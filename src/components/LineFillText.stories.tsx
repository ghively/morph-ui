import type { StoryDefault, Story } from '@ladle/react';
import { LineFillText } from "./LineFillText";

export const Default = () => (
  <div style={{ padding: "3rem", fontSize: "2.5rem", fontWeight: 700 }}>
    <LineFillText text="Interfaces that morph" />
  </div>
);

export const SlowFill = () => (
  <div style={{ padding: "3rem", fontSize: "2.5rem", fontWeight: 700 }}>
    <LineFillText text="Interfaces that morph" fillDelay="1.4s" />
  </div>
);
