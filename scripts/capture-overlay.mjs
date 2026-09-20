import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });

const page = await browser.newPage({
  viewport: { width: 1920, height: 160 },
  deviceScaleFactor: 1
});

await page.goto("http://127.0.0.1:4173", {
  waitUntil: "networkidle"
});

await page.screenshot({
  path: "img/overlay.png",
  fullPage: false
});

await browser.close();
