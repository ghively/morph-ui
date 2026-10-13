import { useState } from "react";
import { SwipeDeck } from "./SwipeDeck";

function swipeCard(title: string, body: string, accent: string) {
  return (
    <div
      style={{
        width: 280,
        height: 380,
        borderRadius: 20,
        padding: "1.5rem",
        boxSizing: "border-box",
        background: `linear-gradient(160deg, ${accent}, #0b1030)`,
        color: "#eef1fc",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: "0.5rem",
      }}
    >
      <strong style={{ fontSize: "1.2rem" }}>{title}</strong>
      <span style={{ fontSize: "0.85rem", opacity: 0.8, lineHeight: 1.5 }}>{body}</span>
    </div>
  );
}

const cards = [
  swipeCard("gh-ai", "Primary agent host — 18 containers, all healthy.", "#3b5bdb"),
  swipeCard("gh-media", "SSH refusing connections since 04:12 UTC.", "#e8590c"),
  swipeCard("gh-arm", "LiteLLM proxy, 4 registered providers.", "#0ca678"),
  swipeCard("gh-git", "Self-hosted GitLab, 171 repositories mirrored.", "#7048e8"),
];

export const Default = () => (
  <div style={{ padding: "3rem", display: "flex", justifyContent: "center" }}>
    <SwipeDeck cards={cards} onSwipe={() => {}} />
  </div>
);

export const Empties = () => {
  const [deck, setDeck] = useState(cards);
  return (
    <div style={{ padding: "3rem", display: "flex", justifyContent: "center" }}>
      <SwipeDeck cards={deck} onSwipe={(_dir, i) => {
        // drop the swiped card so the deck can reach its empty state
        setDeck((prev) => prev.filter((_, idx) => idx !== i));
      }} />
    </div>
  );
};
