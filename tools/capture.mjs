// Captures full-page screenshots and layout/typography measurements for each
// page at each width, from either the live Squarespace site or a local build.
//
//   node tools/capture.mjs live                      -> tools/out/live
//   node tools/capture.mjs local http://localhost:3000 -> tools/out/local
//
// Drives the installed Chrome (no browser download) via playwright-core.
import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES } from "./pages.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));


const target = process.argv[2] ?? "live";
const base =
  process.argv[3] ?? (target === "live" ? "https://www.teloscollege.org" : "http://localhost:3000");
const only = process.env.PAGES ? process.env.PAGES.split(",") : null;
const widths = (process.env.WIDTHS ?? "1440,390").split(",").map(Number);
const outDir = path.join(here, "out", target);

// Runs in the page. DOM-agnostic so the same dump works on Squarespace and on
// the rebuild; compare.mjs matches entries across the two by text / file name.
function extract() {
  const round = (n) => Math.round(n * 10) / 10;
  const rect = (el) => {
    const r = el.getBoundingClientRect();
    return { x: round(r.left), y: round(r.top + scrollY), w: round(r.width), h: round(r.height) };
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0;
  };
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const font = (el) => {
    const cs = getComputedStyle(el);
    return {
      family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      size: cs.fontSize,
      weight: cs.fontWeight,
      style: cs.fontStyle,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      transform: cs.textTransform,
      align: cs.textAlign,
      color: cs.color,
      decoration: cs.textDecorationLine,
    };
  };
  const box = (el) => {
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor,
      bgImage: cs.backgroundImage === "none" ? undefined : cs.backgroundImage.slice(0, 200),
      border: cs.borderTopWidth === "0px" ? undefined : `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
      radius: cs.borderTopLeftRadius === "0px" && cs.borderBottomLeftRadius === "0px" ? undefined : cs.borderRadius,
      padding: cs.padding,
      margin: cs.margin,
    };
  };
  const fileOf = (src) => {
    try {
      const url = new URL(src, location.href);
      // next/image serves /_next/image?url=<original>
      const original = url.searchParams.get("url") ?? url.pathname;
      return decodeURIComponent(original).split("/").pop();
    } catch {
      return src;
    }
  };

  const out = {
    url: location.href,
    title: document.title,
    viewport: { w: innerWidth, h: innerHeight, docH: document.documentElement.scrollHeight },
    bodyBg: getComputedStyle(document.body).backgroundColor,
    regions: [],
    text: [],
    images: [],
    controls: [],
  };

  document.querySelectorAll("[data-section-id], section.section").forEach((el) => {
    if (!visible(el)) return;
    const bgEl = el.querySelector(":scope > .section-border > .section-background, :scope > .section-bg") ?? el;
    out.regions.push({
      tag: el.tagName.toLowerCase(),
      id: el.id || el.getAttribute("data-section-id"),
      ...rect(el),
      position: getComputedStyle(el).position,
      bg: getComputedStyle(bgEl).backgroundColor,
    });
  });

  const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH", "OPTION"]);
  document.body.querySelectorAll("*").forEach((el) => {
    if (skip.has(el.tagName.toUpperCase()) || el.closest("svg") || !visible(el)) return;
    const tag = el.tagName.toLowerCase();

    if (tag === "img") {
      const cs = getComputedStyle(el);
      out.images.push({
        file: fileOf(el.currentSrc || el.src || el.getAttribute("data-src") || ""),
        alt: el.alt,
        ...rect(el),
        natural: `${el.naturalWidth}x${el.naturalHeight}`,
        fit: cs.objectFit,
        pos: cs.objectPosition,
        radius: cs.borderRadius,
        opacity: cs.opacity,
      });
      return;
    }

    if (["a", "button", "input", "textarea", "select", "label"].includes(tag)) {
      out.controls.push({
        tag,
        type: el.getAttribute("type") ?? undefined,
        text: norm(el.innerText || el.value || el.getAttribute("placeholder") || el.getAttribute("aria-label") || ""),
        href: el.getAttribute("href") ?? undefined,
        ...rect(el),
        font: font(el),
        box: box(el),
      });
    }

    // One entry per text node, boxed by its rendered lines, so the result
    // doesn't depend on which wrapper elements the text sits in.
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim()) continue;
      // measure the visible characters only; trailing spaces don't draw
      const raw = node.textContent;
      const range = document.createRange();
      range.setStart(node, raw.length - raw.trimStart().length);
      range.setEnd(node, raw.trimEnd().length);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0.5);
      if (!rects.length) continue;
      const r = range.getBoundingClientRect();
      const first = rects[0];
      out.text.push({
        tag,
        text: norm(node.textContent).slice(0, 200),
        x: round(r.left),
        y: round(r.top + scrollY),
        w: round(r.width),
        h: round(r.height),
        lines: new Set(rects.map((q) => Math.round(q.top))).size,
        firstX: round(first.left),
        font: font(el),
      });
    }
  });

  return out;
}

// Squarespace-only detail used while building: section chrome, fluid-engine
// grids and block placement. Returns null on the rebuild.
function extractSquarespace() {
  if (!document.querySelector(".fluid-engine, .page-section")) return null;
  const round = (n) => Math.round(n * 10) / 10;
  const rect = (el) => {
    const r = el.getBoundingClientRect();
    return { x: round(r.left), y: round(r.top + scrollY), w: round(r.width), h: round(r.height) };
  };
  const pick = (el, props) => {
    const cs = getComputedStyle(el);
    return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
  };
  const root = getComputedStyle(document.documentElement);
  const vars = {};
  for (const name of [
    "--sqs-site-max-width",
    "--sqs-site-gutter",
    "--sqs-mobile-site-gutter",
    "--heading-1-size-value",
    "--heading-2-size-value",
    "--heading-3-size-value",
    "--heading-4-size-value",
    "--normal-text-size-value",
    "--large-text-size-value",
    "--small-text-size-value",
  ]) {
    vars[name] = root.getPropertyValue(name).trim();
  }

  const sections = [...document.querySelectorAll("section.page-section")].map((s) => {
    const bg = s.querySelector(".section-background");
    const border = s.querySelector(".section-border");
    const wrap = s.querySelector(".content-wrapper");
    const content = s.querySelector(".content");
    const fe = s.querySelector(".fluid-engine");
    const divider = s.querySelector(".section-divider-display");
    return {
      id: s.id || s.dataset.sectionId,
      cls: s.className.replace(/\s+/g, " ").trim(),
      theme: s.dataset.sectionTheme,
      ...rect(s),
      section: pick(s, ["min-height", "padding-top", "padding-bottom", "z-index"]),
      border: border && pick(border, ["border-radius", "clip-path", "top", "bottom", "left", "right"]),
      bg: bg && pick(bg, ["background-color", "background-image"]),
      bgImg: bg?.querySelector("img")?.currentSrc,
      divider: divider && { ...rect(divider), ...pick(divider, ["clip-path", "background-color"]) },
      wrap: wrap && { ...rect(wrap), ...pick(wrap, ["padding-top", "padding-bottom", "padding-left", "padding-right", "max-width", "justify-content", "align-items"]) },
      content: content && { ...rect(content), ...pick(content, ["width", "max-width"]) },
      grid: fe && {
        ...rect(fe),
        ...pick(fe, ["grid-template-columns", "grid-template-rows", "row-gap", "column-gap"]),
      },
      blocks: [...s.querySelectorAll(".fe-block")].map((b) => {
        const inner = b.querySelector(".sqs-block");
        return {
          cls: b.className,
          type: inner?.className.match(/sqs-block-(\w+)/)?.[1],
          ...rect(b),
          ...pick(b, ["grid-area", "z-index", "mix-blend-mode"]),
          align: inner && pick(inner, ["justify-content", "align-items"]),
          text: (b.innerText || "").replace(/\s+/g, " ").trim().slice(0, 80),
        };
      }),
    };
  });

  const header = document.querySelector("#header");
  return {
    vars,
    header: header && {
      ...rect(header),
      ...pick(header, ["position", "background-color", "padding-top", "padding-bottom"]),
    },
    sections,
  };
}

// Cleaned markup + the per-section <style> blocks (fluid-engine grid rules).
function extractMarkup() {
  const styles = [...document.querySelectorAll("body style")].map((s) => s.textContent).join("\n\n");
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll("script, style, noscript, iframe, link").forEach((n) => n.remove());
  return { html: clone.innerHTML, styles };
}

async function settle(page) {
  // Scroll through to trigger lazy images and scroll-in animations.
  await page.evaluate(async () => {
    const step = innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    scrollTo(0, 0);
  });
  await page
    .waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 })
    .catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
await fs.mkdir(outDir, { recursive: true });

for (const width of widths) {
  const mobile = width < 768;
  const context = await browser.newContext({
    viewport: { width, height: mobile ? 844 : 900 },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  for (const p of PAGES) {
    if (only && !only.includes(p.name)) continue;
    const page = await context.newPage();
    const url = base + (target === "live" ? p.live : p.local);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    } catch (e) {
      console.warn(`! ${url}: ${e.message.split("\n")[0]}`);
    }
    await settle(page);
    const stem = path.join(outDir, `${p.name}-${width}`);
    await page.screenshot({ path: `${stem}.png`, fullPage: true });
    await fs.writeFile(`${stem}.json`, JSON.stringify(await page.evaluate(extract), null, 1));
    const sqs = await page.evaluate(extractSquarespace);
    if (sqs) {
      await fs.writeFile(`${stem}.sqs.json`, JSON.stringify(sqs, null, 1));
      const { html, styles } = await page.evaluate(extractMarkup);
      await fs.writeFile(`${stem}.dom.html`, html);
      await fs.writeFile(`${stem}.styles.css`, styles);
    }
    console.log(`${p.name} @ ${width}: ${url}`);
    await page.close();
  }
  await context.close();
}
await browser.close();
