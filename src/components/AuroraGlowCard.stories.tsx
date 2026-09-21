import { AuroraGlowCard } from "./AuroraGlowCard";

const cardBody = (
  <div style={{ padding: "1.5rem", minWidth: 260 }}>
    <h3 style={{ margin: "0 0 0.5rem" }}>Aurora Telemetry</h3>
    <p style={{ margin: 0, opacity: 0.8, fontSize: "0.9rem" }}>
      Live ingestion across 12 edge nodes, 4.2k events per second.
    </p>
  </div>
);

export const Default = () => (
  <div style={{ padding: "3rem" }}>
    <AuroraGlowCard>{cardBody}</AuroraGlowCard>
  </div>
);

export const Active = () => (
  <div style={{ padding: "3rem" }}>
    <AuroraGlowCard
      active
      intensity={1.4}
      glowColor1="#6c9cf0"
      glowColor2="#a855f7"
      glowColor3="#22d3ee"
    >
      {cardBody}
    </AuroraGlowCard>
  </div>
);
