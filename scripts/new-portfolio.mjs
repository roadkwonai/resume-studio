// Copies a template into portfolios/<slug> as a standalone app and installs the profile.
// Usage: npm run new -- <template-id> <slug> [path/to/profile.json]
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { validate } from "../shared/validate.mjs";

const root = new URL("..", import.meta.url).pathname;
const [templateArg, slug, profilePath] = process.argv.slice(2);
const selection = join(root, "selection.json");
const template = templateArg === "selected" ? JSON.parse(readFileSync(selection, "utf8")).template : templateArg;
const source = join(root, "templates", template ?? "");
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

if (!template || !slug) fail("usage: npm run new -- <template-id|selected> <slug> [profile.json]");
if (!existsSync(join(source, "template.json"))) fail(`unknown template: ${template}`);
if (!/^[a-z0-9-]+$/.test(slug)) fail("slug must be lowercase a-z, 0-9, -");
const target = join(root, "portfolios", slug);
if (existsSync(target)) fail(`portfolios/${slug} already exists`);

if (profilePath) {
  const errors = validate(JSON.parse(readFileSync(profilePath, "utf8")));
  if (errors.length) fail(errors.join("\n"));
}

const skip = new Set(["node_modules", ".next", "docs", "tsconfig.tsbuildinfo"]);
cpSync(source, target, { recursive: true, filter: (path) => !skip.has(basename(path)) });
mkdirSync(join(target, "public/profile"), { recursive: true });

const ports = readdirSync(join(root, "portfolios")).filter((name) => name !== slug).length;
const port = 4200 + ports;
const pkgPath = join(target, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = `@resume/portfolio-${slug}`;
pkg.scripts.dev = `next dev -p ${port}`;
pkg.scripts.start = `next start -p ${port}`;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
if (profilePath) cpSync(profilePath, join(target, "content/profile.json"));

console.log(`portfolios/${slug} from ${template}, port ${port}`);
