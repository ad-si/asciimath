// Shared DOM bootstrap for Node test runs.
//
// The asciimath modules touch `document` at import time (to install a
// stylesheet, register a DOMContentLoaded listener, etc.), so a jsdom global
// must be in place *before* importing them.

import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>");

const assign = (key, value) => {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value,
  });
};

assign("window", dom.window);
assign("document", dom.window.document);
assign("navigator", dom.window.navigator);
assign("Node", dom.window.Node);
assign("Element", dom.window.Element);
assign("HTMLElement", dom.window.HTMLElement);
assign("DocumentFragment", dom.window.DocumentFragment);

export { dom };
