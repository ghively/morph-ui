import { TextBlurReveal } from "./TextBlurReveal";

export const Default = () => (
  <div style={{ padding: "3rem", fontSize: "2rem", fontWeight: 600 }}>
    <TextBlurReveal text="Clarity arrives one character at a time" />
  </div>
);

export const WordModeOnScroll = () => (
  <div style={{ padding: "3rem", fontSize: "2rem", fontWeight: 600 }}>
    <TextBlurReveal
      text="Clarity arrives one word at a time"
      mode="word"
      trigger="scroll"
      staggerDelay={80}
    />
  </div>
);
