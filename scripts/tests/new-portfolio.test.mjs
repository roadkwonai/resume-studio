import { strict as assert } from "node:assert";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));
const script = join(root, "scripts/new-portfolio.mjs");
const fixture = join(root, "shared/fixtures/full.ko.json");
const temp = mkdtempSync(join(tmpdir(), "resume-generator-test-"));
const target = join(temp, "site with spaces");
const slug = `skill-test-${process.pid}`;
const defaultTarget = join(dirname(root), `${slug}-resume`);
let createdDefault = false;
const run = (...args) => spawnSync(process.execPath, [script, "stackbit-os", slug, fixture, ...args], { encoding: "utf8" });
try {
  assert.equal(run(target).status, 0);
  assert.equal(readFileSync(join(target, "content/profile.json"), "utf8"), readFileSync(fixture, "utf8"));
  assert.ok(existsSync(join(target, ".env.example")));
  execFileSync("git", ["init", "-q", target]);
  for (const path of ["content/profile.json", "public/profile/test.png", "resume.pdf", ".env.local"]) {
    execFileSync("git", ["-C", target, "check-ignore", "-q", path]);
  }
  assert.notEqual(spawnSync("git", ["-C", target, "check-ignore", "-q", ".env.example"]).status, 0);
  assert.notEqual(run(target).status, 0);
  assert.equal(readFileSync(join(target, "content/profile.json"), "utf8"), readFileSync(fixture, "utf8"));
  assert.notEqual(run(join(root, "portfolios", slug)).status, 0);
  symlinkSync(root, join(temp, "repository-link"));
  assert.notEqual(run(join(temp, "repository-link", "portfolios", slug)).status, 0);
  assert.equal(existsSync(defaultTarget), false);
  const defaultResult = run();
  createdDefault = defaultResult.status === 0;
  assert.equal(defaultResult.status, 0);
  assert.ok(existsSync(join(defaultTarget, ".env.example")));
  console.log("External generation, privacy defaults, symlink boundary and overwrite protection passed");
} finally {
  rmSync(temp, { recursive: true, force: true });
  if (createdDefault) rmSync(defaultTarget, { recursive: true, force: true });
}
