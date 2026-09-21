import { ExpandingCardGrid } from "./ExpandingCardGrid";
import type { ExpandingCardItem } from "./ExpandingCardGrid";

function thumb(title: string, accent: string) {
  return (
    <div
      style={{
        padding: "1.25rem",
        borderRadius: 12,
        background: `linear-gradient(150deg, ${accent}, #0b1030)`,
        color: "#eef1fc",
        minHeight: 120,
        display: "flex",
        alignItems: "flex-end",
        fontWeight: 600,
      }}
    >
      {title}
    </div>
  );
}

function body(text: string) {
  return (
    <div style={{ padding: "1.25rem", fontSize: "0.9rem", lineHeight: 1.6 }}>{text}</div>
  );
}

const items: ExpandingCardItem[] = [
  {
    id: "ingest",
    thumbnail: thumb("Ingest", "#3b5bdb"),
    content: body("Forty upstream feeds normalized into a single event envelope before fan-out."),
  },
  {
    id: "enrich",
    thumbnail: thumb("Enrich", "#7048e8"),
    content: body("Entity extraction, sentiment, and dedup keys attached in one pass."),
  },
  {
    id: "route",
    thumbnail: thumb("Route", "#0ca678"),
    content: body("Per-tenant routing rules decide which agents see which envelopes."),
  },
  {
    id: "archive",
    thumbnail: thumb("Archive", "#e8590c"),
    content: body("Cold storage with a 400-day retention window and hash-chained audit."),
  },
];

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <ExpandingCardGrid items={items} />
  </div>
);
