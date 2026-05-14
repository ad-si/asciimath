// Smoke tests derived from the historical browser test pages.
//
// Each `issue*.html` / `*test.html` page in this directory was originally
// inspected visually, looking at the rendered MathML. There are no expected
// output strings to compare against, so we treat each ASCIIMath expression
// (delimited by backticks in the source HTML) as a smoke test: it must parse
// without throwing and produce a `<math>` node with at least one descendant.

import "./setup-dom.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const asciimath = await import("../dist/index.js");
const texImg = await import("../dist/tex-img.js");

// Files in test/ that exercise the main ASCIIMathML library.
const MAIN_FILES = [
  "issue133test.html",
  "issue136test.html",
  "issue155test.html",
  "issue156test.html",
  "issue15test.html",
  "issue30test.html",
  "issue42test.html",
  "issue74test.html",
  "issue77test.html",
  "issue86test.html",
  "issue94test.html",
  "invistest.html",
  "livetest.html",
  "overparen.html",
  "varianttest.html",
];

// Files that exercise the TeX-image variant.
const TEXIMG_FILES = [
  "issue136testimg.html",
  "issue42testimg.html",
  "overparenimg.html",
];

const extractBacktickExpressions = (path) => {
  const html = readFileSync(path, "utf8");
  const matches = html.match(/`[^`]+`/g) ?? [];
  return matches.map((m) => m.slice(1, -1));
};

for (const file of MAIN_FILES) {
  const path = join(here, file);
  const expressions = extractBacktickExpressions(path);

  test(`${basename(file)} — ${expressions.length} expressions parse`, () => {
    assert.ok(expressions.length > 0, `expected to find at least one backtick expression in ${file}`);
    for (const expr of expressions) {
      const node = asciimath.parseMath(expr);
      assert.ok(node, `parseMath(${JSON.stringify(expr)}) returned null`);
      assert.equal(node.nodeName, "math");
      assert.ok(node.firstChild, `${file}: ${JSON.stringify(expr)} produced an empty <math>`);
    }
  });
}

for (const file of TEXIMG_FILES) {
  const path = join(here, file);
  const expressions = extractBacktickExpressions(path);

  test(`${basename(file)} — ${expressions.length} tex-img expressions parse`, () => {
    assert.ok(expressions.length > 0, `expected to find at least one backtick expression in ${file}`);
    for (const expr of expressions) {
      const out = texImg.AMparseMath(expr);
      assert.ok(out, `AMparseMath(${JSON.stringify(expr)}) returned a falsy value`);
    }
  });
}

// Defensive check: every file in test/ that uses ASCIIMathML.js or
// ASCIIMathTeXImg.js should be covered by one of the lists above. Surface
// new untracked files so they are not silently ignored.
test("all html test pages are accounted for", () => {
  const known = new Set([...MAIN_FILES, ...TEXIMG_FILES,
    "amlm.html", "index.html", "lm.html", "lmtest.html", "lmconverter.html",
    "unittests.html"]);
  const allHtml = readdirSync(here).filter((f) => f.endsWith(".html"));
  const untracked = allHtml.filter((f) => !known.has(f));
  assert.deepEqual(untracked, [], "new .html test pages need to be added to MAIN_FILES, TEXIMG_FILES, or the LaTeX skip list");
});
