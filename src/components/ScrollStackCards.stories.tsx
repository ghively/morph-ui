import type { StoryDefault, Story } from '@ladle/react';
import { ScrollStackCards } from "./ScrollStackCards";
import type { ScrollStackCard } from "./ScrollStackCards";

function stackCard(title: string, body: string, accent: string) {
  return (
    <div
      style={{
        padding: "2rem",
        borderRadius: 18,
        background: `linear-gradient(150deg, ${accent}, #0b1030)`,
        color: "#eef1fc",
        minHeight: 220,
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ margin: "0 0 0.75rem" }}>{title}</h3>
      <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}

const cards: ScrollStackCard[] = [
  { id: "one", content: stackCard("Observe", "Collect signals before deciding anything.", "#3b5bdb") },
  { id: "two", content: stackCard("Orient", "Place the signal against what you already believe.", "#7048e8") },
  { id: "three", content: stackCard("Decide", "Pick the smallest reversible next action.", "#0ca678") },
  { id: "four", content: stackCard("Act", "Run it, then read the output before moving on.", "#e8590c") },
];

export const Default = () => <ScrollStackCards cards={cards} />;
