import type { StoryDefault, Story } from '@ladle/react';
import { TextScribble } from "./TextScribble";

export const Default = () => (
  <div style={{ padding: "3rem", fontSize: "1.75rem" }}>
    <TextScribble playOnMount>hand-annotated</TextScribble>
  </div>
);

export const Variants = () => (
  <div style={{ padding: "3rem", fontSize: "1.75rem", display: "grid", gap: "2rem" }}>
    <TextScribble type="underline" playOnMount>
      underlined
    </TextScribble>
    <TextScribble type="strike" playOnMount color="#f08c6c">
      struck through
    </TextScribble>
    <TextScribble type="circle" playOnMount color="#63c79b" duration="0.9s" delay="0.2s">
      circled
    </TextScribble>
  </div>
);
