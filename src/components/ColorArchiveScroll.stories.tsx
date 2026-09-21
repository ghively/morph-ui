import type { StoryDefault, Story } from '@ladle/react';
import { ColorArchiveScroll } from "./ColorArchiveScroll";
import type { ArchiveItem } from "./ColorArchiveScroll";

function swatch(hex: string, label: string): string {
  const svg = `
<svg width="320" height="200" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="200" fill="${hex}"/>
  <text x="20" y="180" font-family="monospace" font-size="18" fill="rgba(255,255,255,0.85)">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

const items: ArchiveItem[] = [
  {
    id: "deep-indigo",
    color: "#2b2d64",
    title: "Deep Indigo",
    previewImage: swatch("#2b2d64", "#2b2d64"),
    description: "Base surface for the dark frame; carries the elevated panel stack.",
  },
  {
    id: "signal-blue",
    color: "#6c9cf0",
    title: "Signal Blue",
    previewImage: swatch("#6c9cf0", "#6c9cf0"),
    description: "Primary interactive accent — links, focus rings, active tabs.",
  },
  {
    id: "ember",
    color: "#f08c6c",
    title: "Ember",
    previewImage: swatch("#f08c6c", "#f08c6c"),
    description: "Warning and degraded-state highlight across agent telemetry.",
  },
  {
    id: "moss",
    color: "#63c79b",
    title: "Moss",
    previewImage: swatch("#63c79b", "#63c79b"),
    description: "Healthy, settled, or completed status indicator.",
  },
];

export const Default = () => <ColorArchiveScroll items={items} />;
