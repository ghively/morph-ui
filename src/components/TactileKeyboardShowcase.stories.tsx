import type { StoryDefault, Story } from '@ladle/react';
import { TactileKeyboardShowcase } from "./TactileKeyboardShowcase";

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <TactileKeyboardShowcase colorway="classic" />
  </div>
);

export const RetroWithSound = () => (
  <div style={{ padding: "2rem" }}>
    <TactileKeyboardShowcase colorway="retro" enableSound />
  </div>
);
