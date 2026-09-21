import type { StoryDefault, Story } from '@ladle/react';
import { CardDeckReveal } from "./CardDeckReveal";

function deckCard(title: string, body: string, accent: string) {
  return (
    <div
      style={{
        width: 280,
        height: 180,
        borderRadius: 16,
        padding: "1.25rem",
        background: `linear-gradient(140deg, ${accent}, rgba(10, 14, 36, 0.95))`,
        color: "#eef1fc",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        boxSizing: "border-box",
      }}
    >
      <strong style={{ fontSize: "1.05rem" }}>{title}</strong>
      <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{body}</span>
    </div>
  );
}

const cards = [
  deckCard("Ingest", "Normalize 40 source feeds", "#3b5bdb"),
  deckCard("Enrich", "Attach entity + sentiment tags", "#7048e8"),
  deckCard("Publish", "Fan out to downstream agents", "#0ca678"),
];

export const Default = () => (
  <div style={{ padding: "3rem" }}>
    <CardDeckReveal cards={cards} />
  </div>
);

export const AutoAdvancing = () => (
  <div style={{ padding: "3rem" }}>
    <CardDeckReveal cards={cards} autoAdvanceInterval={2500} />
  </div>
);
