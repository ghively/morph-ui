import { useState } from "react";
import { ContextSwitcher } from "./ContextSwitcher";

const options = ["Workspace", "Agents", "Archive", "Telemetry"];

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <ContextSwitcher current="Workspace" options={options} onChange={() => {}} />
  </div>
);

export const Interactive = () => {
  const [current, setCurrent] = useState("Agents");
  return (
    <div style={{ padding: "2rem" }}>
      <ContextSwitcher current={current} options={options} onChange={setCurrent} />
      <p style={{ marginTop: "1rem", fontSize: "0.85rem", opacity: 0.75 }}>
        Selected context: <strong>{current}</strong>
      </p>
    </div>
  );
};
