// Static build for GitHub Pages: the gallery at the site root, each template under templates/<id>/.
// Usage: node scripts/build-pages.mjs [template-id...]   Output: site/
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const base = process.env.PAGES_ROOT ?? "/resume-studio";
const site = join(root, "site");
const only = process.argv.slice(2);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

function build(dir, prefix, target) {
  rmSync(join(dir, "out"), { recursive: true, force: true });
  execFileSync("npx", ["next", "build"], { cwd: dir, stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, PAGES_BASE: prefix } });
  // basePath covers routes and _next, not plain "/sites/x.png" strings in content, CSS and scripts.
  const folders = existsSync(join(dir, "public")) ? readdirSync(join(dir, "public")).filter((n) => statSync(join(dir, "public", n)).isDirectory()) : [];
  if (folders.length) {
    const asset = new RegExp(`(["'\`(]|\\\\")/(${folders.join("|")})/`, "g");
    for (const file of walk(join(dir, "out"))) {
      if (!/\.(html|js|css|txt|json)$/.test(file)) continue;
      const text = readFileSync(file, "utf8");
      const next = text.replace(asset, `$1${prefix}/$2/`);
      if (next !== text) writeFileSync(file, next);
    }
  }
  cpSync(join(dir, "out"), target, { recursive: true });
}

if (!only.length) rmSync(site, { recursive: true, force: true });
for (const id of readdirSync(join(root, "templates"))) {
  if (only.length && !only.includes(id)) continue;
  console.log(`building ${id}…`);
  build(join(root, "templates", id), `${base}/templates/${id}`, join(site, "templates", id));
}
if (!only.length || only.includes("gallery")) {
  console.log("building gallery…");
  build(join(root, "gallery"), base, site);
}
console.log(`site: ${site}`);
