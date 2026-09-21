import { DimensionalBookCover } from "./DimensionalBookCover";

export const Default = () => (
  <div style={{ padding: "3rem" }}>
    <DimensionalBookCover
      coverContent={
        <div
          style={{
            width: 220,
            height: 320,
            background: "linear-gradient(150deg, #2b2d64, #0b1030)",
            color: "#eef1fc",
            padding: "1.5rem",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.18em", opacity: 0.7 }}>
            FIELD MANUAL
          </span>
          <strong style={{ fontSize: "1.5rem", lineHeight: 1.2 }}>
            Designing Agent Interfaces
          </strong>
        </div>
      }
      spineContent={
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em" }}>MORPH UI</span>
      }
      pageContent={
        <div style={{ padding: "1.25rem", fontSize: "0.85rem", lineHeight: 1.6 }}>
          <p style={{ marginTop: 0 }}>
            Chapter 3 — Making latency legible without making it loud.
          </p>
          <p style={{ marginBottom: 0, opacity: 0.75 }}>
            An interface that hides work makes the agent feel unreliable; one that narrates
            every step makes it feel frantic.
          </p>
        </div>
      }
    />
  </div>
);
