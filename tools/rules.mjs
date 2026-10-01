// Prints the authored CSS rules (with their calc() formulas and media queries)
// that match the first element for each selector on a live page.
//
//   node tools/rules.mjs /home 1440 "h1" ".sqs-block-button-element"
import { chromium } from "playwright-core";

const [, , pagePath, widthArg, ...selectors] = process.argv;
const width = Number(widthArg);
const filter = process.env.PROPS ? new RegExp(process.env.PROPS) : null;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width, height: width < 768 ? 844 : 900 },
  isMobile: width < 768,
  hasTouch: width < 768,
});
const page = await context.newPage();
await page.goto("https://www.teloscollege.org/" + pagePath.replace(/^\//, ""), { waitUntil: "networkidle" });
const cdp = await context.newCDPSession(page);
await cdp.send("DOM.enable");
await cdp.send("CSS.enable");
const { root } = await cdp.send("DOM.getDocument");

for (const selector of selectors) {
  const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector });
  console.log(`\n=================== ${selector} @ ${width}`);
  if (!nodeId) {
    console.log("  (no match)");
    continue;
  }
  const { matchedCSSRules, inlineStyle } = await cdp.send("CSS.getMatchedStylesForNode", { nodeId });
  const used = new Set();
  const print = (label, props) => {
    const decls = props
      .filter((p) => !p.name.startsWith("--") && p.text !== undefined && !p.disabled)
      .filter((p) => !filter || filter.test(p.name))
      .map((p) => {
        for (const m of p.value.matchAll(/var\((--[\w-]+)/g)) used.add(m[1]);
        return `${p.name}: ${p.value}${p.important ? " !important" : ""}`;
      });
    if (decls.length) console.log(`${label} { ${decls.join("; ")} }`);
  };
  for (const { rule } of matchedCSSRules) {
    if (rule.origin !== "regular") continue;
    const media = (rule.media ?? []).map((m) => m.text).filter(Boolean).join(" and ");
    print(`${media ? `@media ${media} ` : ""}${rule.selectorList.text}`, rule.style.cssProperties);
  }
  if (inlineStyle) print("[inline]", inlineStyle.cssProperties);
  if (used.size) {
    const vals = await page.evaluate(
      ([sel, names]) => {
        const cs = getComputedStyle(document.querySelector(sel));
        return names.map((n) => `${n}: ${cs.getPropertyValue(n).trim()}`);
      },
      [selector, [...used]],
    );
    console.log("  vars -> " + vals.join(" | "));
  }
}
await browser.close();
