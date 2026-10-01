// Dumps the resolved color/tweak custom properties for each section theme.
import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const out = {};
for (const p of ["home", "contact", "pilot-employers"]) {
  await page.goto("https://www.teloscollege.org/" + p, { waitUntil: "networkidle" });
  Object.assign(out, await page.evaluate(() => {
    const res = {};
    const grab = (el, key) => {
      if (res[key]) return;
      const o = {};
      for (const [name, val] of el.computedStyleMap()) {
        if (!name.startsWith("--")) continue;
        if (/portfolio|product|blog|course|events|menu-block|video|gallery|summary|quote|accordion|chart|donation|opentable|tock|scheduling|member|paywall|commerce|cart|checkout|review|pricing|marquee|list-section|user-items|announcement|lesson|image-block-(card|collage|overlap|poster|stack)|cookie|mailing|social-links-block|audio|search|archive|calendar|rss|toc|code-block/i.test(name)) continue;
        o[name] = String(val[0]).trim();
      }
      res[key] = o;
    };
    grab(document.documentElement, ":root");
    grab(document.body, "body");
    document.querySelectorAll("[data-section-theme]").forEach((el) => grab(el, "theme:" + el.dataset.sectionTheme));
    return res;
  }));
}
// keep only vars that differ from :root/body or that look relevant
const root = { ...out[":root"], ...out["body"] };
const keep = /Color|color|hsl|button|radius|stroke|padding|font|size|width|gutter|height|line|spacing|shape|form|newsletter|social|overlay|blend/;
const lines = [];
lines.push("## root/body");
for (const [k, v] of Object.entries(root)) if (keep.test(k) && !/-hsl$/.test(k) || /(accent|lightAccent|darkAccent|white|black)-hsl/.test(k)) lines.push(`${k}: ${v}`);
for (const [key, vars] of Object.entries(out)) {
  if (!key.startsWith("theme:")) continue;
  lines.push("\n## " + key);
  for (const [k, v] of Object.entries(vars)) if (root[k] !== v && keep.test(k)) lines.push(`${k}: ${v}`);
}
console.log(lines.join("\n"));
await browser.close();
