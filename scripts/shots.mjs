// Full-page screenshots for the gallery's contact sheet. Needs the templates running (npm run studio).
// Usage: node scripts/shots.mjs [id=http://host:port ...]
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const root = new URL("..", import.meta.url).pathname;
const require = createRequire(join(execSync("npm root -g", { encoding: "utf8" }).trim(), "/"));
const puppeteer = require("puppeteer-core");

const overrides = Object.fromEntries(process.argv.slice(2).map((arg) => arg.split(/=(.*)/s).slice(0, 2)));
const templates = readdirSync(join(root, "templates")).map((id) => JSON.parse(readFileSync(join(root, "templates", id, "template.json"), "utf8")));

const out = join(root, "gallery/public/shots");
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 0.75 },
});
const sizes = {};
try {
  for (const { id, port } of templates) {
    const page = await browser.newPage();
    await page.goto(overrides[id] ?? `http://localhost:${port}/`, { waitUntil: "networkidle2", timeout: 90000 });
    await new Promise((r) => setTimeout(r, 4500)); // preloaders finish
    // Scroll through once so scroll-driven reveals and lazy images fire before the capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 900));
    });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({ path: join(out, `${id}.jpg`), type: "jpeg", quality: 78, fullPage: true });
    sizes[id] = { width: 1440, height };
    console.log(`${id}: ${height}px`);
    await page.close();
  }
} finally {
  await browser.close();
}
writeFileSync(join(root, "gallery/src/shots.json"), `${JSON.stringify(sizes, null, 2)}\n`);
