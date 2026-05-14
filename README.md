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
import { parseMath, translate, AMprocessNode, newcommand } from "asciimath";

// Convert a string to a MathML <math> Node.
const mathNode = parseMath("sum_(i=1)^n i = n(n+1)/2");
document.body.appendChild(mathNode);

// Re-run translation on a specific subtree.
AMprocessNode(document.getElementById("content"), false);

// Define a custom macro.
newcommand("RR", "\\mathbb{R}");
```

### LaTeXMathML

```js
import { LatexToMathML } from "asciimath/latex";

const html = LatexToMathML("\\frac{a}{b}");
```

### MathJax plugin

```js
import { register } from "asciimath/mathjax";

// Call after MathJax has loaded its `InputJax.AsciiMath` slot:
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
npm install      # install dev dependencies (TypeScript)
npm run build    # compile src/*.ts to dist/
npm run check    # type-check without emitting
```

The historical browser test pages in `test/` still reference the legacy
`ASCIIMathML.js` script in the project root; they are not part of the
published package.
