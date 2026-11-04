import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// The agent building the portfolio reads this file, so it lives at the studio root.
const file = join(process.cwd(), "..", "selection.json");

export async function readSelection(): Promise<string | null> {
  try {
    return (JSON.parse(await readFile(file, "utf8")) as { template: string }).template;
  } catch {
    return null;
  }
}

export async function writeSelection(template: string) {
  await writeFile(file, `${JSON.stringify({ template, selectedAt: new Date().toISOString() }, null, 2)}\n`);
}
