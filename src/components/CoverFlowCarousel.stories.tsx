import { CoverFlowCarousel } from "./CoverFlowCarousel";
import type { CoverFlowItem } from "./CoverFlowCarousel";

function cover(title: string, accent: string) {
  return (
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: 12,
        background: `linear-gradient(160deg, ${accent}, #0b1030)`,
        color: "#eef1fc",
        display: "flex",
        alignItems: "flex-end",
        padding: "1rem",
        boxSizing: "border-box",
        fontWeight: 600,
      }}
    >
      {title}
    </div>
  );
}

const items: CoverFlowItem[] = [
  { id: "aurora", content: cover("Aurora", "#3b5bdb") },
  { id: "meridian", content: cover("Meridian", "#7048e8") },
  { id: "halcyon", content: cover("Halcyon", "#0ca678") },
  { id: "vesper", content: cover("Vesper", "#e8590c") },
  { id: "lumen", content: cover("Lumen", "#1098ad") },
];

export const Default = () => (
  <div style={{ padding: "3rem 0" }}>
    <CoverFlowCarousel items={items} />
  </div>
);

export const MirroredFloor = () => (
  <div style={{ padding: "3rem 0" }}>
    <CoverFlowCarousel items={items} mirroredFloor />
  </div>
);
