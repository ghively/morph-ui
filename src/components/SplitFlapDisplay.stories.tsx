import { useState } from "react";
import { SplitFlapDisplay } from "./SplitFlapDisplay";

export const Default = () => (
  <div style={{ padding: "3rem" }}>
    <SplitFlapDisplay value="MORPH UI" />
  </div>
);

export const PaddedCounter = () => {
  const [n, setN] = useState(249);
  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
      <SplitFlapDisplay value={String(n)} padLength={6} align="end" />
      <button onClick={() => setN((v) => v + 1)}>Advance</button>
    </div>
  );
};
