import type { StoryDefault, Story } from '@ladle/react';
import { ParticleImage } from "./ParticleImage";

const particleSource = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `
<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="320" fill="#080c2c"/>
  <circle cx="160" cy="160" r="110" fill="#3b5bdb"/>
  <circle cx="160" cy="160" r="70" fill="#6c9cf0"/>
  <circle cx="160" cy="160" r="30" fill="#eef1fc"/>
</svg>`.trim(),
)}`;

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <ParticleImage src={particleSource} alt="Concentric blue discs on a dark field" />
  </div>
);

export const HighDensity = () => (
  <div style={{ padding: "2rem" }}>
    <ParticleImage
      src={particleSource}
      alt="Concentric blue discs on a dark field"
      density={2}
    />
  </div>
);
