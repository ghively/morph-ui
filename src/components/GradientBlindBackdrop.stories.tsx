import type { StoryDefault, Story } from '@ladle/react';
import { useRef } from "react";
import { GradientBlindBackdrop } from "./GradientBlindBackdrop";

export const Default = () => (
  <div style={{ position: "relative", height: 420 }}>
    <GradientBlindBackdrop />
  </div>
);

export const ActiveWithScrollTarget = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div style={{ position: "relative", height: 420 }}>
      <GradientBlindBackdrop state="active" scrollTarget={scrollRef} />
      <div
        ref={scrollRef}
        style={{ position: "relative", height: "100%", overflowY: "auto", padding: "2rem" }}
      >
        {Array.from({ length: 14 }, (_, index) => (
          <p key={index} style={{ margin: "0 0 1.5rem" }}>
            Scroll line {index + 1} — the backdrop reacts to this container's scroll position.
          </p>
        ))}
      </div>
    </div>
  );
};
