// Screenshots of interactive states (desktop nav dropdown, mobile menu and its
// folder panel) on the live site and the local build, for side-by-side review.
//
//   node tools/states.mjs
import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const targets = {
  live: { base: "https://www.teloscollege.org", page: "/pilot-students" },
  local: { base: process.argv[2] ?? "http://localhost:3000", page: "/pilot-students" },
};
const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const [name, t] of Object.entries(targets)) {
  const dir = path.join(here, "out", "states");
  await fs.mkdir(dir, { recursive: true });

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let page = await desktop.newPage();
  await page.goto(t.base + t.page, { waitUntil: "networkidle" });
  await page.getByText("Pilot Program").first().hover();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(dir, `${name}-dropdown.png`), clip: { x: 1040, y: 0, width: 400, height: 260 } });
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  page = await mobile.newPage();
  await page.goto(t.base + t.page, { waitUntil: "networkidle" });
  await page.locator("button.burger:visible").first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(dir, `${name}-menu.png`) });
  await page.locator(".menu-item button:visible, .header-menu-nav-item a:visible").filter({ hasText: "Pilot Program" }).first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(dir, `${name}-menu-folder.png`) });
  await mobile.close();
  console.log(name, "done");
}
await browser.close();
