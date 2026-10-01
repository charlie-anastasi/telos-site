// Sends one clearly-labelled test submission through each of the site's three
// forms, using the page UI, and reports what Formspree answered.
//
//   node tools/test-forms.mjs https://telos-site-seven.vercel.app
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3000";
const email = process.env.TEST_EMAIL ?? "charlie@teloscollege.org";
const note = (form) => `Test of the ${form} form on ${new URL(base).host}. Safe to delete.`;

const cases = [
  { name: "contact", path: "/contact", scope: ".form-card", fill: true },
  { name: "pilot early access", path: "/contact-1", scope: ".form-card", fill: true },
  { name: "newsletter", path: "/", scope: ".newsletter", fill: false },
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let failed = false;
for (const c of cases) {
  await page.goto(base + c.path, { waitUntil: "networkidle" });
  const form = page.locator(c.scope);
  await form.scrollIntoViewIfNeeded();
  if (c.fill) {
    await form.locator('input[name="fname"]').fill("Test");
    await form.locator('input[name="lname"]').fill("Submission");
    await form.locator('textarea[name="message"]').fill(note(c.name));
  }
  await form.locator('input[name="email"]').fill(email);
  const answer = page.waitForResponse((r) => r.url().includes("formspree.io/f/"), { timeout: 30000 });
  await form.locator('button[type="submit"]').click();
  const response = await answer.catch(() => null);
  const body = response ? await response.text().catch(() => "") : "(no response)";
  await page.waitForTimeout(800);
  const shown = (await form.innerText()).replace(/\s+/g, " ").trim();
  const ok = Boolean(response?.ok()) && shown.includes("Thank you!");
  failed ||= !ok;
  console.log(`${ok ? "✓" : "✗"} ${c.name}: HTTP ${response?.status() ?? "-"} ${body.slice(0, 200)}`);
  console.log(`   page shows: "${shown.slice(0, 120)}"`);
}
await browser.close();
process.exit(failed ? 1 : 0);
