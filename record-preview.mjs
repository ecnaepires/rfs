// Record road.html playing naturally at 1280x720 for N seconds (headless Chrome).
import { chromium } from "/opt/sunergies-marketing/node_modules/playwright/index.mjs";
const url = process.argv[2], secs = +process.argv[3] || 120, dir = process.argv[4] || "/tmp/rec";
const browser = await chromium.launch({ channel: "chrome", chromiumSandbox: false, args: ["--autoplay-policy=no-user-gesture-required", "--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir, size: { width: 1280, height: 720 } } });
const page = await ctx.newPage();
page.on("console", (m) => { if (m.type() === "error") console.log("console:", m.text()); });
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1500);
await page.click("#start");
if (process.argv[5]) { await page.waitForTimeout(800); await page.evaluate((i) => jumpTo(+i), process.argv[5]); }
await page.waitForTimeout(secs * 1000);
const log = await page.evaluate(() => ({ state, cur: typeof cur !== "undefined" ? cur : null }));
console.log("end state", JSON.stringify(log));
await ctx.close(); await browser.close();
