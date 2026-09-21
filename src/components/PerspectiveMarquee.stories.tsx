import { PerspectiveMarquee } from "./PerspectiveMarquee";
import type { PerspectiveMarqueeRow } from "./PerspectiveMarquee";

function tile(hex: string, label: string): string {
  const svg = `
<svg width="240" height="160" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="160" fill="${hex}"/>
  <text x="16" y="146" font-family="monospace" font-size="16" fill="rgba(255,255,255,0.8)">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

function row(id: string, direction: "left" | "right", speed: number, palette: string[]): PerspectiveMarqueeRow {
  return {
    id,
    direction,
    speed,
    images: palette.map((hex, index) => ({
      id: `${id}-${index}`,
      src: tile(hex, `${id}-${index}`),
      alt: `Swatch ${hex} in row ${id}`,
    })),
  };
}

const rows: PerspectiveMarqueeRow[] = [
  row("top", "left", 26, ["#3b5bdb", "#7048e8", "#0ca678", "#e8590c"]),
  row("middle", "right", 34, ["#1098ad", "#f08c6c", "#2b2d64", "#63c79b"]),
  row("bottom", "left", 30, ["#6c9cf0", "#a855f7", "#22d3ee", "#f59f00"]),
];

export const Default = () => <PerspectiveMarquee rows={rows} />;
