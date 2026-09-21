import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "../src/tokens.css";

afterEach(cleanup);

// jsdom lacks matchMedia; components use it for reduced-motion / responsive checks.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom lacks pointer capture APIs.
if (typeof Element !== "undefined") {
  Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || function () {};
  Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture || function () {};
  Element.prototype.hasPointerCapture =
    Element.prototype.hasPointerCapture ||
    function () {
      return false;
    };
}
