// Checks a finished portfolio: profile valid, production build passes, no demo person left in the output.
// Usage: npm run verify -- <slug|absolute-path>
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { validate } from "../shared/validate.mjs";

const root = new URL("..", import.meta.url).pathname;
const slug = process.argv[2];
if (!slug) throw new Error("usage: npm run verify -- <slug|absolute-path>");
const dir = isAbsolute(slug) ? resolve(slug) : join(root, "portfolios", slug);

const errors = validate(JSON.parse(readFileSync(join(dir, "content/profile.json"), "utf8")));
execFileSync("npx", ["next", "build"], { cwd: dir, stdio: ["ignore", "ignore", "inherit"] });

function* files(path) {
  for (const name of readdirSync(path)) {
    const full = join(path, name);
    if (statSync(full).isDirectory()) yield* files(full);
    else if (/\.(html|rsc|meta)$/.test(name)) yield full;
  }
}

const profile = readFileSync(join(dir, "content/profile.json"), "utf8");
// A marker the owner's own profile contains (a shared employer, a city) is not a leak.
const markers = JSON.parse(readFileSync(join(dir, "template.json"), "utf8")).demoMarkers.filter((m) => !profile.includes(m));
const leaks = new Set();
for (const file of files(join(dir, ".next/server/app"))) {
  const text = readFileSync(file, "utf8");
  markers.filter((m) => text.includes(m)).forEach((m) => leaks.add(m));
}
leaks.forEach((m) => errors.push(`demo content left in the build: "${m}"`));
errors.forEach((e) => console.error(`✗ ${e}`));
console.log(errors.length ? `${errors.length} problem(s)` : `${dir} is clean`);
process.exit(errors.length ? 1 : 0);
