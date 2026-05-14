// Port of test/unittests.html.
//
// The original test suite loaded `unittests.js` plus jQuery in a browser and
// compared the inner HTML of the `<mstyle>` element produced by
// `asciimath.parseMath(input)` against the expected string.
//
// This file does the same, but headlessly via jsdom + node:test.

import "./setup-dom.mjs";
import test from "node:test";
import assert from "node:assert/strict";

const asciimath = await import("../dist/index.js");
const { unittests } = await import("./unittests.js");

const DEFAULT_DECIMAL = ".";
const DEFAULT_LIST = ",";

for (const tc of unittests) {
  const label = describe(tc);
  test(label, () => {
    if (tc.decimal !== undefined) asciimath.setdecimal(tc.decimal);
    if (tc.list !== undefined) asciimath.setlistseparator(tc.list);

    let actual;
    try {
      const node = asciimath.parseMath(tc.input);
      const mstyle = node.querySelector("mstyle");
      assert.ok(mstyle, `parseMath(${JSON.stringify(tc.input)}) produced no <mstyle>`);
      actual = mstyle.innerHTML;
    } finally {
      // Always restore defaults so the next test starts from a clean slate.
      if (tc.decimal !== undefined) asciimath.setdecimal(DEFAULT_DECIMAL);
      if (tc.list !== undefined) asciimath.setlistseparator(DEFAULT_LIST);
    }

    assert.equal(actual, tc.output);
  });
}

function describe(tc) {
  const flags = [];
  if (tc.decimal !== undefined) flags.push(`decimal=${tc.decimal}`);
  if (tc.list !== undefined) flags.push(`list=${tc.list}`);
  return flags.length ? `${tc.input} [${flags.join(", ")}]` : tc.input;
}
