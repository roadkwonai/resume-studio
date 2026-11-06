// Copies a template into a separate standalone app and installs the profile.
// Usage: npm run new -- <template-id> <slug> [path/to/profile.json] [output-directory]
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { validate } from "../shared/validate.mjs";

const root = new URL("..", import.meta.url).pathname;
const [templateArg, slug, profilePath, outputPath] = process.argv.slice(2);
const selection = join(root, "selection.json");
const template = templateArg === "selected" ? JSON.parse(readFileSync(selection, "utf8")).template : templateArg;
const source = join(root, "templates", template ?? "");
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

if (!template || !slug) fail("usage: npm run new -- <template-id|selected> <slug> [profile.json] [output-directory]");
if (!existsSync(join(source, "template.json"))) fail(`unknown template: ${template}`);
if (!/^[a-z0-9-]+$/.test(slug)) fail("slug must be lowercase a-z, 0-9, -");
const target = outputPath ? resolve(outputPath) : resolve(root, "..", `${slug}-resume`);
let parent = dirname(target);
while (!existsSync(parent)) parent = dirname(parent);
const actualTarget = resolve(realpathSync(parent), relative(parent, target));
const fromRoot = relative(realpathSync(root), actualTarget);
if (!fromRoot || (fromRoot !== ".." && !fromRoot.startsWith(`..${sep}`))) fail("output must be outside Resume Studio");
if (existsSync(target)) fail(`output already exists: ${target}`);

if (profilePath) {
  const errors = validate(JSON.parse(readFileSync(profilePath, "utf8")));
  if (errors.length) fail(errors.join("\n"));
}

const skip = new Set(["node_modules", ".next", "docs", "tsconfig.tsbuildinfo"]);
cpSync(source, target, { recursive: true, filter: (path) => !skip.has(basename(path)) });
mkdirSync(join(target, "public/profile"), { recursive: true });
writeFileSync(join(target, ".gitignore"), "\n# 개인 자료는 기본적으로 Git에서 제외합니다\ncontent/profile.json\npublic/profile/\n*.pdf\n.env*\n!.env.example\n", { flag: "a" });
cpSync(join(root, ".claude/skills/resume-portfolio/assets/env.example"), join(target, ".env.example"));

const ports = readdirSync(join(root, "portfolios")).filter((name) => name !== slug).length;
const port = 4200 + ports;
const pkgPath = join(target, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = `@resume/portfolio-${slug}`;
pkg.scripts.dev = `next dev -p ${port}`;
pkg.scripts.start = `next start -p ${port}`;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
if (profilePath) cpSync(profilePath, join(target, "content/profile.json"));

console.log(`${target} from ${template}, port ${port}`);
