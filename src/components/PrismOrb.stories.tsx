import type { StoryDefault, Story } from '@ladle/react';
import { PrismOrb } from "./PrismOrb";

export const Default = () => (
  <div style={{ padding: "3rem" }}>
    <PrismOrb state="idle" size={160} />
  </div>
);

export const Listening = () => (
  <div style={{ padding: "3rem" }}>
    <PrismOrb state="listening" size={160} />
  </div>
);

export const Speaking = () => (
  <div style={{ padding: "3rem" }}>
    <PrismOrb state="speaking" size={160} />
  </div>
);
