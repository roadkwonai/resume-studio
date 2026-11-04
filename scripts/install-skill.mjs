// Copies the resume-portfolio skill into each agent's user skill folder, so it works outside this repository.
// Usage: npm run skill:install -- [claude] [codex] [antigravity] [--force]   (no name installs all three)
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const source = new URL("../.claude/skills/resume-portfolio", import.meta.url).pathname;
const home = homedir();
const gemini = join(home, ".gemini");
const targets = {
  claude: [join(home, ".claude/skills")],
  codex: [join(home, ".agents/skills")],
  // Antigravity moved its global folder; the older ones are filled only when that install is present.
  antigravity: [
    join(gemini, "config/skills"),
    ...["antigravity-cli/skills", "antigravity/skills"].map((p) => join(gemini, p)).filter((p) => existsSync(p)),
  ],
};

const args = process.argv.slice(2);
const force = args.includes("--force");
const names = args.filter((a) => a !== "--force");
const unknown = names.filter((n) => !targets[n]);
if (unknown.length) {
  console.error(`unknown agent: ${unknown.join(", ")} (use claude, codex, antigravity)`);
  process.exit(1);
}

for (const name of names.length ? names : Object.keys(targets)) {
  for (const dir of targets[name]) {
    const target = join(dir, "resume-portfolio");
    if (existsSync(target) && !force) {
      console.log(`skipped ${target}: already there, use --force to replace it`);
      continue;
    }
    rmSync(target, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    cpSync(source, target, { recursive: true });
    console.log(`installed ${target}`);
  }
}
