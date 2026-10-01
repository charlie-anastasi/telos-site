// One-time importer: reads each live Squarespace page at desktop and mobile
// widths and writes a page.tsx built from the components in
// src/components/blocks.tsx. After the migration the generated pages are the
// source of truth and are edited by hand, so existing pages are skipped
// unless FORCE=1 is set.
//
//   FORCE=1 node tools/import.mjs            -> all pages + the shared footer
//   FORCE=1 PAGES=home node tools/import.mjs -> one page
import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES } from "./pages.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const only = process.env.PAGES ? process.env.PAGES.split(",") : null;
const imageNames = JSON.parse(await fs.readFile(path.join(here, "out", "live", "image-names.json"), "utf8"));

// ---------------------------------------------------------------- in-page
function extractModel() {
  const cs = (el) => getComputedStyle(el);
  const fileOf = (src) => (src ? src.split("?")[0].split("/").pop() : null);

  const serialize = (node) => {
    if (node.nodeType === 3) return { text: node.textContent };
    if (node.nodeType !== 1) return null;
    const tag = node.tagName.toLowerCase();
    const out = { tag, cls: [...node.classList], children: [] };
    const style = node.getAttribute("style");
    if (style) out.style = style;
    for (const a of ["href", "target", "data-rte-list", "start"]) {
      if (node.hasAttribute(a)) (out.attrs ??= {})[a] = node.getAttribute(a);
    }
    if (node.classList.contains("sqsrte-text-highlight")) {
      // the drawn underline lives in a sibling node keyed by the same id
      const shape = node
        .closest(".sqs-block")
        ?.querySelector(`.TextShape-node[data-text-attribute-id="${node.dataset.textAttributeId}"]`);
      out.highlight = { shape: shape?.dataset.shape, strokeWidth: shape?.style.getPropertyValue("--stroke-width").trim() };
    }
    for (const c of node.childNodes) {
      const s = serialize(c);
      if (s) out.children.push(s);
    }
    return out;
  };

  const blockModel = (b) => {
    const inner = b.querySelector(".sqs-block");
    const c = cs(b);
    const m = {
      key: [...b.classList].find((x) => x.startsWith("fe-block-")),
      type:
        inner?.className.match(/sqs-block-(?!website)(\w+)/)?.[1] ??
        inner?.dataset.definitionName?.split(".").pop() ??
        "unknown",
      area: `${c.gridRowStart}/${c.gridColumnStart}/${c.gridRowEnd}/${c.gridColumnEnd}`,
      z: c.zIndex,
      display: c.display,
      transform: c.transform,
      opacity: c.opacity,
      v: inner ? cs(inner).justifyContent : null,
    };
    const wrap = b.querySelector(".sqs-block-alignment-wrapper");
    if (wrap) m.wrap = { h: cs(wrap).justifyContent, v: cs(wrap).alignItems };

    if (m.type === "html") {
      m.html = serialize(b.querySelector(".sqs-html-content")).children;
    } else if (m.type === "button") {
      const a = b.querySelector("a.sqs-block-button-element");
      const cont = b.querySelector(".sqs-block-button-container");
      m.button = {
        text: a.textContent.trim(),
        href: a.getAttribute("href"),
        target: a.getAttribute("target"),
        size: a.className.match(/sqs-block-button-element--(\w+)/)?.[1],
        variant: a.className.match(/sqs-button-element--(\w+)/)?.[1],
        align: cont.className.match(/sqs-block-button-container--(\w+)/)?.[1],
        stretched: cont.classList.contains("sqs-stretched"),
      };
    } else if (m.type === "image") {
      const img = b.querySelector("img");
      const cont = b.querySelector(".fluid-image-container");
      const overlay = b.querySelector(".fluidImageOverlay");
      const rootEl = b.querySelector(".fluid-image-component-root");
      const link = img.closest("a");
      m.image = {
        file: fileOf(img.getAttribute("data-src") || img.src),
        alt: img.alt,
        natural: [img.naturalWidth, img.naturalHeight],
        fit: cs(img).objectFit,
        position: cs(img).objectPosition,
        radius: cs(cont).borderRadius,
        containerW: cs(cont).width,
        containerH: cs(cont).height,
        blockW: b.getBoundingClientRect().width,
        blockH: b.getBoundingClientRect().height,
        hAlign: rootEl.className.match(/image-position-(\w+)/)?.[1],
        overlay: overlay && { color: cs(overlay).backgroundColor, opacity: cs(overlay).opacity, blend: cs(overlay).mixBlendMode },
        href: link?.getAttribute("href") ?? null,
      };
    } else if (m.type === "horizontalrule") {
      const hr = b.querySelector("hr");
      m.rule = { color: cs(hr).backgroundColor, height: cs(hr).height };
    } else if (m.type === "shape") {
      const sh = b.querySelector(".sqs-shape");
      const s = cs(sh);
      const inner2 = sh.firstElementChild ? cs(sh.firstElementChild) : s;
      m.shape = {
        name: b.querySelector("[data-shape-name]")?.dataset.shapeName,
        fill: inner2.fill,
        stroke: inner2.stroke,
        strokeWidth: inner2.strokeWidth,
        filter: s.filter,
        containerFilter: cs(sh.parentElement).filter,
        rx: sh.firstElementChild?.getAttribute("rx") ?? null,
      };
    }
    return m;
  };

  const sectionModel = (s, where) => {
    const bg = s.querySelector(".section-background");
    const bgImg = bg?.querySelector("img");
    const overlay = bg?.querySelector(".section-background-overlay");
    const wrap = s.querySelector(".content-wrapper");
    const fe = s.querySelector(".fluid-engine");
    const height = s.className.match(/section-height--(\w+)/)?.[1] ?? "auto";
    const pad = wrap.getAttribute("style")?.match(/padding-top:\s*calc\(([\d.]+)vmax/)?.[1];
    return {
      where,
      anchor: s.id || null,
      sid: s.dataset.sectionId,
      theme: s.dataset.sectionTheme,
      height,
      minHeight: s.style.minHeight || null,
      pad: pad ?? null,
      padComputed: cs(wrap).paddingTop,
      divider: s.classList.contains("has-section-divider"),
      // the rounded divider can be flipped so the corners curve down instead of up
      dividerFlip: /^M0,\s*1\s/.test(s.querySelector(".section-divider-clip")?.getAttribute("d") ?? ""),
      z: cs(s).zIndex,
      bgColor: bg ? cs(bg).backgroundColor : null,
      bg: bgImg && {
        file: fileOf(bgImg.getAttribute("data-src") || bgImg.src),
        position: cs(bgImg).objectPosition,
        overlayOpacity: overlay ? cs(overlay).opacity : null,
        overlayColor: overlay ? cs(overlay).backgroundColor : null,
      },
      rows: fe ? cs(fe).gridTemplateRows.split(" ").length : 0,
      blocks: fe ? [...fe.querySelectorAll(":scope > .fe-block")].map(blockModel) : [],
    };
  };

  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? "",
    sections: [
      ...[...document.querySelectorAll("#page section.page-section")].map((s) => sectionModel(s, "main")),
      ...[...document.querySelectorAll("#footer-sections section.page-section")].map((s) => sectionModel(s, "footer")),
    ],
  };
}

// ------------------------------------------------------------- JSX emission
const COLOR = { accent: "navy", lightAccent: "light", darkAccent: "blue", white: "white", black: "black" };
const V = { "flex-start": "start", center: "center", "flex-end": "end", normal: "start" };

const esc = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
const jsxText = (s) => {
  if (s === "") return "";
  // JSX trims/collapses whitespace around newlines; keep exact text when it matters.
  if (/^\s|\s$|\s{2,}|\n/.test(s)) return `{${JSON.stringify(s)}}`;
  return esc(s);
};
const href = (h) => (h === "/home" ? "/" : h);

function nodeToJsx(n) {
  if ("text" in n) return jsxText(n.text);
  const classes = [];
  let tag = n.tag;
  for (const c of n.cls) {
    if (c === "sqsrte-large") classes.push("large");
    else if (c === "sqsrte-small") classes.push("small");
    else if (c.startsWith("sqsrte-text-color--")) classes.push(COLOR[c.slice(19)] ?? c.slice(19));
    else if (c === "sqsrte-text-highlight") tag = "Highlight";
  }
  const style = {};
  for (const decl of (n.style ?? "").split(";")) {
    const [k, v] = decl.split(":").map((x) => x?.trim());
    if (!k || !v) continue;
    if (k === "white-space") continue; // pre-wrap is the default for text blocks
    if (k === "text-align") {
      if (v !== "left" && v !== "start") classes.push(v);
    } else style[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  let children = n.children;
  // <h2><span class="navy">…</span></h2> -> <h2 className="navy">…</h2>
  while (
    tag !== "Highlight" &&
    children.length === 1 &&
    children[0].tag === "span" &&
    !children[0].style &&
    children[0].cls.length === 1 &&
    children[0].cls[0].startsWith("sqsrte-text-color--")
  ) {
    classes.push(COLOR[children[0].cls[0].slice(19)]);
    children = children[0].children;
  }
  let after = "";
  if (tag === "Highlight") {
    // keep trailing whitespace outside the underline
    children = structuredClone(children);
    let last = children.at(-1);
    while (last && !("text" in last)) last = last.children.at(-1);
    const trail = last?.text.match(/\s+$/)?.[0];
    if (trail) {
      last.text = last.text.slice(0, -trail.length);
      after = `{${JSON.stringify(trail)}}`;
    }
  }
  const inner = children.map(nodeToJsx).join("");
  if (tag === "span" && !classes.length && !Object.keys(style).length) return inner;
  if (tag === "Highlight") {
    const stroke = n.highlight?.strokeWidth && n.highlight.strokeWidth !== "0.05em" ? ` stroke="${n.highlight.strokeWidth}"` : "";
    return `<Highlight${stroke}>${inner}</Highlight>${after}`;
  }
  let attrs = "";
  if (tag !== "Highlight" && classes.length) attrs += ` className="${classes.join(" ")}"`;
  if (Object.keys(style).length) attrs += ` style={${JSON.stringify(style)}}`;
  if (n.attrs?.href) attrs += ` href="${href(n.attrs.href)}"`;
  if (n.attrs?.target) attrs += ` target="${n.attrs.target}" rel="noopener"`;
  if (n.attrs?.["data-rte-list"]) attrs += ` data-rte-list="${n.attrs["data-rte-list"]}"`;
  if (tag === "br") return "<br />";
  return `<${tag}${attrs}>${inner}</${tag}>`;
}

// v="center" / z={4} when both breakpoints agree, v={["start", "center"]} otherwise
const attr = (name, m, d) =>
  m === d ? (typeof d === "string" ? `${name}="${d}"` : `${name}={${d}}`) : `${name}={[${JSON.stringify(m)}, ${JSON.stringify(d)}]}`;
const num = (v) => (v === "auto" ? 0 : Number(v));
// computed transform matrix -> whole degrees of rotation
const rotation = (t) => {
  const m = t?.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const [a, b] = m[1].split(",").map(Number);
  return Math.round((Math.atan2(b, a) * 180) / Math.PI);
};

function blockToJsx(d, m, ctx) {
  const props = [`area={[${JSON.stringify(m.area)}, ${JSON.stringify(d.area)}]}`];
  const zm = num(m.z), zd = num(d.z);
  if (zm || zd) props.push(attr("z", zm, zd));
  const vm = V[m.v] ?? "start", vd = V[d.v] ?? "start";
  if (vm !== "start" || vd !== "start") props.push(attr("v", vm, vd));
  const rm = rotation(m.transform), rd = rotation(d.transform);
  if (rm || rd) props.push(attr("rotate", rm, rd));
  if (m.opacity !== "1" || d.opacity !== "1") ctx.notes.push(`block ${d.key} opacity ${m.opacity}/${d.opacity}`);
  if (m.display === "none") props.push(`hide="mobile"`);
  if (d.display === "none") props.push(`hide="desktop"`);

  let body;
  switch (d.type) {
    case "html":
      body = `<Text>\n${d.html.map(nodeToJsx).filter(Boolean).map((l) => "              " + l).join("\n")}\n            </Text>`;
      ctx.used.add("Text");
      if (body.includes("<Highlight")) ctx.used.add("Highlight");
      break;
    case "button": {
      const b = d.button;
      const p = [`href="${href(b.href)}"`];
      if (b.variant !== "primary") p.push(`variant="${b.variant}"`);
      // size only changes padding on buttons that don't stretch to fill their block
      if (!b.stretched) {
        p.push(`fit align="${b.align}"`);
        if (b.size !== "medium") ctx.notes.push(`button "${b.text}" is size ${b.size} and not stretched`);
      }
      if (b.target) p.push(`newTab`);
      body = `<Button ${p.join(" ")}>${esc(b.text)}</Button>`;
      ctx.used.add("Button");
      break;
    }
    case "image": {
      const i = d.image, im = m.image;
      const file = imageNames[i.file] ?? i.file;
      const p = [`src="/images/${file}"`, `alt=${JSON.stringify(i.alt)}`];
      if (i.fit !== "cover" || im.fit !== "cover") p.push(attr("fit", im.fit, i.fit));
      if (i.position !== "50% 50%") p.push(`focus="${i.position}"`);
      if (i.radius !== "0px") p.push(`radius="${i.radius}"`);
      if (i.overlay && i.overlay.color !== "rgba(0, 0, 0, 0)" && i.overlay.opacity !== "0") p.push(`overlay="${i.overlay.color}"`);
      if (i.hAlign && i.hAlign !== "center") p.push(`align="${i.hAlign}"`);
      if (i.href) p.push(`href="${href(i.href)}"`);
      // above-the-fold pictures on the first section load eagerly
      if (ctx.sectionIndex === 0) p.push("eager");
      p.push(`sizes="(min-width: 768px) ${Math.ceil((i.blockW / 1440) * 100)}vw, ${Math.ceil((im.blockW / 390) * 100)}vw"`);
      body = `<Picture\n              ${p.join("\n              ")}\n            />`;
      ctx.used.add("Picture");
      break;
    }
    case "horizontalrule":
      body = `<Rule />`;
      ctx.used.add("Rule");
      break;
    case "shape": {
      const s = d.shape;
      const p = [];
      if (s.stroke !== "none") p.push(`stroke="${s.stroke}" strokeWidth="${s.strokeWidth}"`);
      body = `<Shape${p.length ? " " + p.join(" ") : ""} />`;
      ctx.used.add("Shape");
      if (s.name !== "rectangle" || s.filter !== "none" || s.containerFilter !== "none") ctx.notes.push(`shape ${d.key}: ${JSON.stringify(s)}`);
      break;
    }
    case "newsletter":
      body = `<Newsletter />`;
      ctx.imports.add(`import { Newsletter } from "@/components/Newsletter";`);
      break;
    case "socialaccountlinks":
      body = `<SocialLinks />`;
      ctx.imports.add(`import { SocialLinks } from "@/components/SocialLinks";`);
      break;
    case "form":
      body = `<ContactForm form="${ctx.page.name}" />`;
      ctx.imports.add(`import { ContactForm } from "@/components/ContactForm";`);
      break;
    default:
      body = `{/* TODO: unsupported block type "${d.type}" */}`;
      ctx.notes.push(`unsupported block ${d.type} ${d.key}`);
  }
  return `          <Block ${props.join(" ")}>\n            ${body}\n          </Block>`;
}

function sectionToJsx(d, m, ctx) {
  const props = [`theme="${d.theme}"`];
  if (d.anchor) props.push(`id="${d.anchor}"`);
  // Squarespace "custom" height: min-height in vh, vertical padding in vmax/10
  if (d.height === "custom" || d.height === "auto") {
    if (d.minHeight && parseFloat(d.minHeight)) props.push(`minHeight={${parseFloat(d.minHeight)}}`);
    if (d.pad && Number(d.pad)) props.push(`pad={${Number(d.pad)}}`);
  } else props.push(`height="${d.height}"`);
  if (d.divider) props.push(`${d.dividerFlip ? 'divider="flip"' : "divider"} z={${num(d.z)}}`);
  if (d.bg) {
    props.push(`bg="/images/${imageNames[d.bg.file] ?? d.bg.file}"`);
    if (d.bg.position !== "50% 50%") props.push(`bgFocus="${d.bg.position}"`);
    if (d.bg.overlayOpacity && d.bg.overlayOpacity !== "0") ctx.notes.push(`section ${d.sid} bg overlay ${d.bg.overlayColor} @ ${d.bg.overlayOpacity}`);
  }
  const blocks = d.blocks.map((b) => {
    const mb = m.blocks.find((x) => x.key === b.key);
    if (!mb) ctx.notes.push(`block ${b.key} missing at mobile width`);
    return blockToJsx(b, mb ?? b, ctx);
  });
  return `      <Section ${props.join(" ")}>\n        <Grid rows={[${m.rows}, ${d.rows}]}>\n${blocks.join("\n")}\n        </Grid>\n      </Section>`;
}

function emit(name, componentName, sections, ctx, metadata) {
  const body = sections.join("\n");
  const blocksImport = `import { ${["Section", "Grid", "Block", ...[...ctx.used].sort()].join(", ")} } from "@/components/blocks";`;
  return [
    metadata ? `import type { Metadata } from "next";` : null,
    blocksImport,
    ...[...ctx.imports].sort(),
    "",
    metadata,
    `export default function ${componentName}() {`,
    `  return (`,
    `    <>`,
    body,
    `    </>`,
    `  );`,
    `}`,
    "",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

// ------------------------------------------------------------------- run
const browser = await chromium.launch({ channel: "chrome", headless: true });
const load = async (livePath, width) => {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  await page.goto("https://www.teloscollege.org" + livePath, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
  const model = await page.evaluate(extractModel);
  await context.close();
  return model;
};

const pascal = (s) => s.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
let footerDone = false;
for (const p of PAGES) {
  if (only && !only.includes(p.name)) continue;
  const d = await load(p.live, 1440);
  const m = await load(p.live, 390);
  await fs.writeFile(path.join(here, "out", "live", `${p.name}.model.json`), JSON.stringify({ desktop: d, mobile: m }, null, 1));

  const ctx = { used: new Set(), imports: new Set(), notes: [], page: p, sectionIndex: 0 };
  const main = d.sections.filter((s) => s.where === "main");
  const jsx = main.map((s, i) => {
    ctx.sectionIndex = i;
    return sectionToJsx(s, m.sections.find((x) => x.sid === s.sid), ctx);
  });
  const title = d.title.replace(/\s+—\s+Telos$/, "");
  const metadata =
    p.name === "home"
      ? null // home uses the site defaults from the root layout
      : `export const metadata: Metadata = {\n  title: ${JSON.stringify(title)},${d.description ? `\n  description: ${JSON.stringify(d.description)},` : ""}\n  alternates: { canonical: "${p.local}" },\n};\n`;
  const dir = path.join(root, "src", "app", p.local === "/" ? "" : p.local.slice(1));
  await fs.mkdir(dir, { recursive: true });
  const target = path.join(dir, "page.tsx");
  // pages are hand-edited after the import; only overwrite when asked to
  const exists = await fs.stat(target).then(() => true, () => false);
  if (exists && !process.env.FORCE) {
    console.log(`${p.name}: page.tsx exists, skipped (set FORCE=1 to overwrite)`);
    continue;
  }
  await fs.writeFile(target, emit(p.name, pascal(p.name) + "Page", jsx, ctx, metadata));
  console.log(`${p.name}: ${main.length} sections, ${main.reduce((n, s) => n + s.blocks.length, 0)} blocks | title=${JSON.stringify(d.title)}`);
  for (const n of ctx.notes) console.log("   note:", n);

  if (!footerDone) {
    const fctx = { used: new Set(), imports: new Set(), notes: [], page: p, sectionIndex: 99 };
    const foot = d.sections.filter((s) => s.where === "footer").map((s) => sectionToJsx(s, m.sections.find((x) => x.sid === s.sid), fctx));
    const src = emit("footer", "FooterSections", foot, fctx, null).replace("export default function", "export function");
    await fs.writeFile(path.join(root, "src", "components", "FooterSections.tsx"), src);
    footerDone = true;
    for (const n of fctx.notes) console.log("   footer note:", n);
  }
}
await browser.close();
