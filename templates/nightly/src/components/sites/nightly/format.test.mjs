import assert from "node:assert/strict";
import { test } from "node:test";
import { figureWidth, fill, parseBody, splitFigure } from "./format.ts";

test("splitFigure separates the number from its unit", () => {
  assert.deepEqual(splitFigure("96 ms"), { digits: "96", unit: "ms" });
  assert.deepEqual(splitFigure("99.9%"), { digits: "99.9", unit: "%" });
  assert.deepEqual(splitFigure("4시간"), { digits: "4", unit: "시간" });
  assert.deepEqual(splitFigure("반나절"), { digits: "반나절", unit: "" });
});

test("figureWidth counts Hangul wider than digits", () => {
  assert.equal(figureWidth("840"), 0.56 * 3);
  assert.equal(figureWidth("일"), 1);
});

test("fill leaves no placeholder behind", () => {
  assert.equal(fill("{a} of {b}", { a: 1 }), "1 of ");
});

test("parseBody groups by heading and keeps code lines verbatim", () => {
  const out = parseBody("Intro\nsecond line\n\n## One\n\nText\n\n- a\n- b\n\n```\nconst x = 1\n\n// y\n```\n\nNext\n\nAfter");
  assert.deepEqual(out, [
    { items: [{ kind: "p", text: "Intro second line" }] },
    { h: "One", items: [
      { kind: "p", text: "Text" },
      { kind: "ul", items: ["a", "b"] },
      { kind: "code", lines: ["const x = 1", "", "// y"] },
      { kind: "p", text: "Next" },
      { kind: "p", text: "After" },
    ] },
  ]);
});
