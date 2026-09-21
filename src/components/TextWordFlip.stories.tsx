import type { StoryDefault, Story } from '@ladle/react';
import { TextWordFlip } from "./TextWordFlip";

export const Default = () => (
  <div style={{ padding: "3rem", fontSize: "2rem", fontWeight: 700 }}>
    <span>Built for </span>
    <TextWordFlip words={["agents", "operators", "reviewers", "humans"]} />
  </div>
);

export const FastInterval = () => (
  <div style={{ padding: "3rem", fontSize: "2rem", fontWeight: 700 }}>
    <TextWordFlip words={["ship", "verify", "commit", "repeat"]} interval={900} />
  </div>
);
