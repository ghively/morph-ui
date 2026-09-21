import type { StoryDefault, Story } from '@ladle/react';
import { DragIntroOrb } from "./DragIntroOrb";

export const Default = () => (
  <div style={{ height: 480, position: "relative" }}>
    <DragIntroOrb onEnter={() => {}} skipLabel="Skip intro" />
  </div>
);

export const ShortThreshold = () => (
  <div style={{ height: 480, position: "relative" }}>
    <DragIntroOrb onEnter={() => {}} dragThreshold={40} skipLabel="Enter workspace" />
  </div>
);
