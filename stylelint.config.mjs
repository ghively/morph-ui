/**
 * Component CSS must take its colours from tokens (var(--…) or color-mix() on
 * tokens) so a themed MorphRoot repaints everything. Shadows, masks and filters
 * may still use black/white alpha literals. Sizes are gated separately by
 * `node scripts/snap-to-scale.mjs --check` (font-size / radius / spacing must
 * use the --t-* / --r-* / --s* scales).
 */
const COLOR_PROPS = "/^(color|background|background-color|background-image|border|border-(top|right|bottom|left|block|inline)(-(start|end))?|border(-(top|right|bottom|left))?-color|outline|outline-color|fill|stroke|caret-color|accent-color|text-decoration-color|column-rule-color)$/";
// Pure black/white (any alpha) is allowed: scrims, sheens and text over media
// are neutral, not palette. Any other literal colour must come from a token.
const LITERAL_COLOR = [
  '/#(?!(?:000|fff|000000|ffffff)\\b)[0-9a-fA-F]{3,8}\\b/i',
  '/\\b(rgba?|hsla?)\\((?!\\s*(?:0\\s*,\\s*0\\s*,\\s*0|255\\s*,\\s*255\\s*,\\s*255)\\s*[,)/])/',
];

// Named skins and media artwork carry literal palettes on purpose (keyboard
// colourways, device hardware, poster art). Everything else is held to tokens.
const SKINS = [
  'KeyboardShowcase', 'TactileKeyboardBoard', 'TactileKeyboardShowcase', 'LaptopFrame', 'DeviceFrame',
  'TerminalEmulator', 'TextChromaReveal', 'TextGlitch', 'DimensionalBookCover',
  'MediaHero', 'PosterCard', 'MediaArtwork', 'CollectionTile', 'MediaInfoBadges', 'mediaLibrary.shared',
];

export default {
  ignoreFiles: ['dist/**', 'catalog-dist/**', 'ds-bundle/**', 'src/tokens.css', 'src/primitives.css', 'docs/**'],
  rules: {
    'declaration-property-value-disallowed-list': { [COLOR_PROPS]: LITERAL_COLOR },
  },
  overrides: [
    { files: SKINS.map((n) => `src/components/${n}.css`), rules: { 'declaration-property-value-disallowed-list': null } },
  ],
};
