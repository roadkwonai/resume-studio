// Copies the shared profile contract into each template and portfolio so each stays a standalone app.
import { cpSync } from "node:fs";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
for (const base of ["templates", "portfolios"]) {
  for (const name of existsSync(join(root, base)) ? readdirSync(join(root, base)) : []) {
    const lib = join(root, base, name, "src/lib");
    if (!existsSync(lib)) continue;
    mkdirSync(lib, { recursive: true });
    copyFileSync(join(root, "shared/profile.ts"), join(lib, "profile.ts"));
  }
}

// Codex and Antigravity read skills from .agents/skills; a copy keeps this working where symlinks do not.
const skill = new URL("../.claude/skills/resume-portfolio", import.meta.url).pathname;
cpSync(skill, new URL("../.agents/skills/resume-portfolio", import.meta.url).pathname, { recursive: true });
