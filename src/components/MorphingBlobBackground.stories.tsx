import { MorphingBlobBackground } from "./MorphingBlobBackground";

export const Default = () => (
  <div style={{ position: "relative", height: 420, overflow: "hidden" }}>
    <MorphingBlobBackground />
  </div>
);

export const CustomPalette = () => (
  <div style={{ position: "relative", height: 420, overflow: "hidden" }}>
    <MorphingBlobBackground colors={["#6c9cf0", "#a855f7", "#22d3ee", "#63c79b"]} blobCount={4} />
  </div>
);
