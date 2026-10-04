import { CardDeckReveal } from "../../src/components/CardDeckReveal";

function deckCard(title: string, body: string, accent: string) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
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

// The deck stretches to its container and offsets the cards behind by ~20px,
// so size the container to one card and leave room below for the stack.
const deckFrame = { width: 300, height: 190, margin: "0 auto 32px" } as const;

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <div style={deckFrame}>
      <CardDeckReveal cards={cards} autoAdvanceInterval={0} />
    </div>
  </div>
);

export const AutoAdvancing = () => (
  <div style={{ padding: "2rem" }}>
    <div style={deckFrame}>
      <CardDeckReveal cards={cards} autoAdvanceInterval={2500} />
    </div>
  </div>
);
