import { FanHoverStack } from "./FanHoverStack";
import type { FanHoverStackItem } from "./FanHoverStack";

function card(label: string, accent: string) {
  return (
    <div
      style={{
        width: 160,
        height: 220,
        borderRadius: 14,
        background: `linear-gradient(160deg, ${accent}, #0b1030)`,
        color: "#eef1fc",
        display: "flex",
        alignItems: "flex-end",
        padding: "1rem",
        boxSizing: "border-box",
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  );
}

const items: FanHoverStackItem[] = [
  { id: "one", content: card("Sprint 41", "#3b5bdb") },
  { id: "two", content: card("Sprint 42", "#7048e8") },
  { id: "three", content: card("Sprint 43", "#0ca678") },
  { id: "four", content: card("Sprint 44", "#e8590c") },
];

export const Default = () => (
  <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
    <FanHoverStack items={items} />
  </div>
);
