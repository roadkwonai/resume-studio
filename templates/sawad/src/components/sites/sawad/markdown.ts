const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(text: string) {
  return escape(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(((?:https?:|mailto:|\/)[^\s)]*)\)/g, '<a href="$2">$1</a>');
}

// shortcut: covers headings (all as h2), paragraphs, "-" lists, code fences, bold, italic, links and inline code; swap for a real parser if posts need tables or images.
export function renderMarkdown(source: string) {
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] | null = null;

  const flush = () => {
    if (paragraph.length) html.push(`<p>${inline(paragraph.join(" "))}</p>`);
    if (list.length) html.push(`<ul>${list.map((item) => `<li><p>${inline(item) || "<br>"}</p></li>`).join("")}</ul>`);
    paragraph = [];
    list = [];
  };
  const flushCode = () => {
    if (code) html.push(`<pre><code>${escape(code.join("\n"))}</code></pre>`);
    code = null;
  };

  for (const line of source.split(/\r?\n/)) {
    const fence = line.startsWith("```");
    if (code && !fence) {
      code.push(line);
    } else if (fence) {
      flush();
      if (code) flushCode();
      else code = [];
    } else {
      const heading = /^#{1,6}\s+(.*)$/.exec(line);
      const item = /^\s*[-*](?:\s+(.*))?$/.exec(line);
      if (heading) {
        flush();
        html.push(`<h2>${inline(heading[1])}</h2>`);
      } else if (item) {
        if (paragraph.length) flush();
        list.push(item[1] ?? "");
      } else if (line.trim()) {
        if (list.length) flush();
        paragraph.push(line.trim());
      } else {
        flush();
      }
    }
  }
  flush();
  flushCode();
  return html.join("");
}
