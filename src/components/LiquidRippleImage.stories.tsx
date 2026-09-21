import { LiquidRippleImage } from "./LiquidRippleImage";

const rippleSource = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `
<svg width="480" height="320" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ripple-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b2a6b"/>
      <stop offset="50%" stop-color="#3b5bdb"/>
      <stop offset="100%" stop-color="#0ca678"/>
    </linearGradient>
  </defs>
  <rect width="480" height="320" fill="url(#ripple-bg)"/>
  <circle cx="150" cy="120" r="60" fill="rgba(255,255,255,0.18)"/>
  <circle cx="330" cy="210" r="90" fill="rgba(255,255,255,0.12)"/>
</svg>`.trim(),
)}`;

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 520 }}>
    <LiquidRippleImage src={rippleSource} alt="Abstract gradient with soft overlapping discs" />
  </div>
);
