// Writes a readable DOM outline (tag, classes, key attributes, size, own text)
// for each live page so the structure can be reviewed without the raw markup.
//
//   node tools/outline.mjs 1440
import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES } from "./pages.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const width = Number(process.argv[2] ?? 1440);

function outline() {
  const lines = [];
  const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "LINK", "META", "IFRAME"]);
  const walk = (el, depth) => {
    if (skip.has(el.tagName)) return;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.display === "none") {
      lines.push(`${"  ".repeat(depth)}${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join(".")} [display:none]`);
      return;
    }
    const attrs = [];
    for (const a of ["href", "src", "data-src", "alt", "type", "name", "placeholder", "style", "data-section-theme", "data-animation-role", "data-text-attribute-id", "data-shape", "data-stretch", "data-image-focal-point", "role", "aria-label", "for", "required"]) {
      const v = el.getAttribute(a);
      if (v) attrs.push(`${a}="${v.length > 140 ? v.slice(0, 140) + "…" : v}"`);
    }
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.replace(/\s+/g, " ").trim())
      .join(" | ");
    const cls = [...el.classList].join(".");
    lines.push(
      `${"  ".repeat(depth)}${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cls ? "." + cls : ""} ` +
        `(${Math.round(r.left)},${Math.round(r.top + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)})` +
        (attrs.length ? ` [${attrs.join(" ")}]` : "") +
        (own ? ` "${own}"` : ""),
    );
    if (el.tagName.toLowerCase() === "svg") return;
    for (const c of el.children) walk(c, depth + 1);
  };
  walk(document.body, 0);
  return lines.join("\n");
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width, height: width < 768 ? 844 : 900 },
  isMobile: width < 768,
  hasTouch: width < 768,
});
for (const p of PAGES) {
  const page = await context.newPage();
  await page.goto("https://www.teloscollege.org" + p.live, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  await fs.writeFile(path.join(here, "out", "live", `${p.name}-${width}.outline.txt`), await page.evaluate(outline));
  console.log(p.name);
  await page.close();
}
await browser.close();
