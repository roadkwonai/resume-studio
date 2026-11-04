// Proves a template really is data-driven: builds it with a fixture profile and searches the output for demo leftovers.
// Usage: node scripts/check-template.mjs <template-id> [fixture=full.ko]   Always restores content/profile.json.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const [id, fixture = "full.ko"] = process.argv.slice(2);
const dir = join(root, "templates", id);
const profile = join(dir, "content/profile.json");
const backup = join(dir, "content/.profile.demo.json");
const { demoMarkers = [] } = JSON.parse(readFileSync(join(dir, "template.json"), "utf8"));

function* files(path) {
  for (const name of readdirSync(path)) {
    const full = join(path, name);
    if (statSync(full).isDirectory()) yield* files(full);
    else if (/\.(html|rsc|meta)$/.test(name)) yield full;
  }
}

copyFileSync(profile, backup);
let failed = false;
try {
  copyFileSync(join(root, `shared/fixtures/${fixture}.json`), profile);
  execFileSync("npx", ["next", "build"], { cwd: dir, stdio: ["ignore", "ignore", "inherit"] });
  const hits = new Map();
  for (const file of files(join(dir, ".next/server/app"))) {
    const text = readFileSync(file, "utf8");
    for (const marker of demoMarkers) if (text.includes(marker)) hits.set(marker, [...(hits.get(marker) ?? []), file.split("/server/app/")[1]]);
  }
  for (const [marker, where] of hits) console.error(`✗ "${marker}" leaked in ${where.length} file(s), e.g. ${where[0]}`);
  failed = hits.size > 0;
  console.log(failed ? "LEAKS FOUND" : `clean: ${demoMarkers.length} demo markers absent with fixture ${fixture}`);
} finally {
  copyFileSync(backup, profile);
  execFileSync("rm", [backup]);
  if (existsSync(join(dir, ".next"))) execFileSync("rm", ["-rf", join(dir, ".next")]);
}
process.exit(failed ? 1 : 0);
