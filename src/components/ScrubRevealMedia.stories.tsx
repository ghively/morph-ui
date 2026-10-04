import { ScrubRevealMedia } from "./ScrubRevealMedia";

// The component cover-fits its art, so on narrow containers the 640px frame
// loses up to ~64px per side. Labels sit inside that safe area: "before" on the
// left half, "after" right-aligned on the right half, both visible at the
// default 50% split.
function frame(
  title: string,
  background: string,
  detail: string,
  side: "left" | "right",
): string {
  const labelX = side === "left" ? 72 : 568;
  const anchor = side === "left" ? "start" : "end";
  const svg = `
<svg width="640" height="400" viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="400" fill="${background}"/>
  <circle cx="200" cy="150" r="70" fill="${detail}" opacity="0.75"/>
  <rect x="320" y="200" width="240" height="140" rx="16" fill="${detail}" opacity="0.55"/>
  <text x="${labelX}" y="364" text-anchor="${anchor}" font-family="monospace" font-size="22" fill="rgba(255,255,255,0.9)">${title}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

const beforeImage = frame("before — raw capture", "#141830", "#6c7a9c", "left");
const afterImage = frame("after — graded", "#0b1030", "#6c9cf0", "right");

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 640 }}>
    <ScrubRevealMedia beforeImage={beforeImage} afterImage={afterImage} />
  </div>
);
