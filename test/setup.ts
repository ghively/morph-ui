import { expect } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
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

// Mock pointer capture functions for jsdom
if (typeof Element !== 'undefined') {
  Element.prototype.setPointerCapture = function() {};
  Element.prototype.releasePointerCapture = function() {};
  Element.prototype.hasPointerCapture = function() { return false; };
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
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

// Mock pointer capture functions for jsdom
if (typeof Element !== 'undefined') {
  Element.prototype.setPointerCapture = function() {};
  Element.prototype.releasePointerCapture = function() {};
  Element.prototype.hasPointerCapture = function() { return false; };
}

// Mock matchMedia for UI tests
if (typeof window.matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
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
}

// Mock pointer capture functions for jsdom
if (typeof Element !== 'undefined' && !Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function() {};
  Element.prototype.releasePointerCapture = function() {};
  Element.prototype.hasPointerCapture = function() { return false; };
}

// Mock matchMedia for UI tests
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
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
}

// Mock pointer capture functions for jsdom
if (typeof Element !== 'undefined' && !Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function() {};
  Element.prototype.releasePointerCapture = function() {};
  Element.prototype.hasPointerCapture = function() { return false; };
}

// Mock matchMedia for UI tests
if (typeof window.matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
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
}

// Mock pointer capture functions for jsdom
if (typeof Element !== 'undefined' && !Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function() {};
  Element.prototype.releasePointerCapture = function() {};
  Element.prototype.hasPointerCapture = function() { return false; };
}
