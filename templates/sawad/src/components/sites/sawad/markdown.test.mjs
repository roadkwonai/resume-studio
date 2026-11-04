// node --test src/components/sites/sawad/markdown.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { renderMarkdown } from "./markdown.ts";

test("blocks", () => {
  assert.equal(renderMarkdown("## 제목\n\n첫 줄\n둘째 줄\n\n- 하나\n- \n\n끝"), "<h2>제목</h2><p>첫 줄 둘째 줄</p><ul><li><p>하나</p></li><li><p><br></p></li></ul><p>끝</p>");
});

test("inline", () => {
  assert.equal(renderMarkdown("**a** *b* `c` [d](https://e.io/f)"), '<p><strong>a</strong> <em>b</em> <code>c</code> <a href="https://e.io/f">d</a></p>');
});

test("code fences keep their text and survive a missing close", () => {
  assert.equal(renderMarkdown("```js\n**a** <b>\n```"), "<pre><code>**a** &lt;b&gt;</code></pre>");
  assert.equal(renderMarkdown("```\nx"), "<pre><code>x</code></pre>");
});

test("raw html and script links stay inert", () => {
  assert.equal(renderMarkdown('<img src=x onerror="a()">'), "<p>&lt;img src=x onerror=&quot;a()&quot;&gt;</p>");
  assert.equal(renderMarkdown("[x](javascript:alert(1))"), "<p>[x](javascript:alert(1))</p>");
});
