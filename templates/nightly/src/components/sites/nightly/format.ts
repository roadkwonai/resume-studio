/** Pure helpers, kept free of JSON imports so `node --test format.test.mjs` can run them directly. */

export const fill = (text: string, vars: Record<string, string | number | undefined>) =>
  text.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

/** "96 ms" -> 96 + ms, "99.9%" -> 99.9 + %, "4시간" -> 4 + 시간. A value that does not start with a number stays whole. */
export function splitFigure(value: string) {
  const m = value.match(/^([\d.,]+)\s*(.*)$/);
  return m ? { digits: m[1], unit: m[2] } : { digits: value, unit: "" };
}

/** Width of a string in em at the figure sizes: Latin digits are about .56em, Hangul and other wide glyphs about 1em. */
export const glyphWidth = (ch: string) => (/[ᄀ-ￜ]/.test(ch) ? 1 : 0.56);
export const figureWidth = (text: string) => Array.from(text).reduce((sum, ch) => sum + glyphWidth(ch), 0);

export type ProseItem = { kind: "p"; text: string } | { kind: "ul"; items: string[] } | { kind: "code"; lines: string[] };
export type ProseSection = { h?: string; items: ProseItem[] };

/* shortcut: headings, paragraphs, lists and code fences only, inline marks stay as typed; add a markdown library if posts need more. */
export function parseBody(md: string): ProseSection[] {
  const sections: ProseSection[] = [{ items: [] }];
  const lines = md.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const { items } = sections[sections.length - 1];
    const last = lines[i - 1]?.trim() ? items[items.length - 1] : undefined;
    if (/^#{1,6}\s/.test(line)) sections.push({ h: line.replace(/^#+\s*/, ""), items: [] });
    else if (line.startsWith("```")) {
      const code: string[] = [];
      while (++i < lines.length && !lines[i].startsWith("```")) code.push(lines[i]);
      items.push({ kind: "code", lines: code });
    } else if (/^[-*]\s/.test(line)) {
      const text = line.slice(2).trim();
      if (last?.kind === "ul") last.items.push(text);
      else items.push({ kind: "ul", items: [text] });
    } else if (line.trim()) {
      if (last?.kind === "p") last.text += ` ${line.trim()}`;
      else items.push({ kind: "p", text: line.trim() });
    }
  }
  return sections;
}
