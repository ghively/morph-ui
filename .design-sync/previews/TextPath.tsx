import { TextPath } from "../../src/components/TextPath";

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <TextPath text="Morph UI — components that bend to their context" path="wave" />
  </div>
);

export const Circle = () => (
  <div style={{ padding: "2rem" }}>
    <TextPath text="ORBITING · ORBITING · " path="circle" repeat={3} duration="14s" />
  </div>
);

export const Arc = () => (
  <div style={{ padding: "2rem" }}>
    <TextPath text="RETRIEVE · RANK · ANSWER ·" path="arc" repeat={3} duration="18s" />
  </div>
);
