import type { StoryDefault, Story } from '@ladle/react';
import { SplitFlapDisplay } from "./SplitFlapDisplay";

export const Default = () => (
  <div style={{ padding: "3rem" }}>
    <SplitFlapDisplay value="MORPH UI" />
  </div>
);

export const PaddedCounter = () => (
  <div style={{ padding: "3rem" }}>
    <SplitFlapDisplay value="249" padLength={6} />
  </div>
);
