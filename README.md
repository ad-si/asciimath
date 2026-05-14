# asciimath

A modern ESM/TypeScript build of the classic
[ASCIIMathML](https://asciimath.org/) library. Converts simple,
calculator-style math expressions on a web page into Presentation MathML
(and, optionally, into LaTeX-rendered images or MathJax input).

## Install

```sh
npm install asciimath
```

## Entry points

| Import                  | Source                       | Description                                                       |
| ----------------------- | ---------------------------- | ----------------------------------------------------------------- |
| `asciimath`             | `src/index.ts`               | Main ASCIIMathML → MathML translator.                             |
| `asciimath/latex`       | `src/latex.ts`               | LaTeXMathML translator (subset of LaTeX → MathML).                |
| `asciimath/tex-img`     | `src/tex-img.ts`             | ASCIIMath → TeX, suitable for image-based rendering pipelines.    |
| `asciimath/mathjax`     | `src/mathjax.ts`             | MathJax `InputJax.AsciiMath` plugin registration.                 |

Every entry point publishes types alongside the JavaScript, so TypeScript
projects get autocomplete and signatures out of the box.

## Usage

### ASCIIMathML (auto-translate on load)

Importing the main entry point in a browser automatically translates the
`<body>` of the document on `DOMContentLoaded`, mirroring the behavior of
the original `<script src="ASCIIMathML.js">` drop-in:

```js
import "asciimath";
```

### Programmatic API

```js
import {
  parseMath,
  translate,
  AMprocessNode,
  newcommand,
  newsymbol,
} from "asciimath";

// Convert a string to a MathML <math> Node.
const mathNode = parseMath("sum_(i=1)^n i = n(n+1)/2");
document.body.appendChild(mathNode);

// Re-run translation on a specific subtree.
AMprocessNode(document.getElementById("content"), false);

// Define a custom macro.
newcommand("RR", "\\mathbb{R}");

// Or register a brand-new symbol with its own MathML mapping.
newsymbol({ input: "lub", tag: "mo", output: "⊔", ttype: 0 });
```

See [asciimath.org/#syntax](https://asciimath.org/#syntax) for the input
language reference.

### LaTeXMathML

```js
import { LatexToMathML, LMprocessNode } from "asciimath/latex";

// Convert a LaTeX string to a MathML string.
const html = LatexToMathML("\\frac{a}{b}");

// Translate every LaTeX expression inside a subtree in place.
LMprocessNode(document.getElementById("content"), false);
```

### ASCIIMath → TeX (image rendering)

`asciimath/tex-img` produces TeX source from ASCIIMath, intended for
pipelines that render math as images (e.g. via a CGI LaTeX renderer):

```js
import { AMTparseAMtoTeX, AMTconfig } from "asciimath/tex-img";

// Point at your TeX-to-image endpoint (the original `AMTcgiloc` global).
globalThis.AMTcgiloc = "https://example.com/cgi-bin/mathtex.cgi";

const tex = AMTparseAMtoTeX("int_0^1 x^2 dx");
// → "{\\int_{{0}}^{{1}}}{x}^{{2}}{\\left.{d}{x}\\right.}"
```

### MathJax plugin

```js
import { register } from "asciimath/mathjax";

// Call after MathJax has loaded; `MathJax.InputJax.AsciiMath` must exist.
register();
```

## Configuration

Defaults match the original ASCIIMathML distribution. To change settings
that the original library exposed via top-level vars (e.g. `decimalsign`,
`listseparator`), use the corresponding setters:

```js
import { setdecimal, setlistseparator } from "asciimath";

setdecimal(",");
setlistseparator(";");
```

## Development

```sh
npm install      # install dev dependencies (TypeScript, jsdom)
npm run build    # compile src/*.ts to dist/
npm run check    # type-check without emitting
npm test         # build, then run the Node test suite
npm run serve    # build and serve test/index.html via miniserve
```

The browser test pages in `test/` (`issue*test.html`, `livetest.html`,
etc.) are smoke-tested headlessly by `test/smoke.test.mjs`: every
backtick-delimited ASCIIMath expression must parse to a non-empty
`<math>` node. They are not part of the published package.
