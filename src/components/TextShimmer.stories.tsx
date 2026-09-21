import { TextShimmer } from "./TextShimmer";

export const Default = () => (
  <div style={{ padding: "3rem", fontSize: "2.25rem", fontWeight: 700 }}>
    <TextShimmer>Generating response…</TextShimmer>
  </div>
);

export const CustomPalette = () => (
  <div style={{ padding: "3rem", fontSize: "2.25rem", fontWeight: 700 }}>
    <TextShimmer duration="1.4s" angle="75deg" color="#4c5aa8" shimmerColor="#eef1fc">
      Generating response…
    </TextShimmer>
  </div>
);
