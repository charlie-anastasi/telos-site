// Evaluates an expression on a live page at several viewport widths.
//   node tools/probe.mjs home "840,860,880" "document.title"
import { chromium } from "playwright-core";
const [, , pagePath, widths, expr] = process.argv;
const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const width of widths.split(",").map(Number)) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, isMobile: width < 768, hasTouch: width < 768 });
  const page = await ctx.newPage();
  await page.goto((process.env.BASE ?? "https://www.teloscollege.org/") + pagePath, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  console.log(width, JSON.stringify(await page.evaluate(expr)));
  await ctx.close();
}
await browser.close();
