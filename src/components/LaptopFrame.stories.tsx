import { LaptopFrame } from "./LaptopFrame";

const screen = (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "linear-gradient(160deg, #1b1f4a, #080c2c)",
      color: "#eef1fc",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "0.5rem",
      fontFamily: "monospace",
    }}
  >
    <strong style={{ fontSize: "1.1rem" }}>morph-ui catalog</strong>
    <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>69 components · 249 tests green</span>
  </div>
);

export const Default = () => (
  <div style={{ padding: "3rem" }}>
    <LaptopFrame>{screen}</LaptopFrame>
  </div>
);

export const StaticOpen = () => (
  <div style={{ padding: "3rem" }}>
    <LaptopFrame animateOpen={false}>{screen}</LaptopFrame>
  </div>
);
