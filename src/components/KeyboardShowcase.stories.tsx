import type { StoryDefault, Story } from '@ladle/react';
import { KeyboardShowcase } from "./KeyboardShowcase";

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <KeyboardShowcase layout="ANSI" finish="silver" />
  </div>
);

export const IsoDarkCapsLock = () => (
  <div style={{ padding: "2rem" }}>
    <KeyboardShowcase layout="ISO" finish="dark" capsLockOn />
  </div>
);

export const SpaceGray = () => (
  <div style={{ padding: "2rem" }}>
    <KeyboardShowcase layout="ANSI" finish="space-gray" />
  </div>
);
