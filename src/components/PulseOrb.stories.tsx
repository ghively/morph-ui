import type { StoryDefault, Story } from '@ladle/react';
import { PulseOrb } from "./PulseOrb";

export const Default = () => (
  <div style={{ padding: "3rem" }}>
    <PulseOrb state="idle" size={140} />
  </div>
);

export const Thinking = () => (
  <div style={{ padding: "3rem" }}>
    <PulseOrb state="thinking" size={140} color="#a855f7" />
  </div>
);

export const Speaking = () => (
  <div style={{ padding: "3rem" }}>
    <PulseOrb state="speaking" size={140} color="#63c79b" />
  </div>
);
