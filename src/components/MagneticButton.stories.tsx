import { MagneticButton } from "./MagneticButton";

export const Default = () => (
  <div style={{ padding: "3rem" }}>
    <MagneticButton onClick={() => {}}>Deploy agent</MagneticButton>
  </div>
);

export const Variants = () => (
  <div style={{ padding: "3rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
    <MagneticButton variant="primary" onClick={() => {}}>
      Deploy agent
    </MagneticButton>
    <MagneticButton variant="secondary" onClick={() => {}}>
      Preview plan
    </MagneticButton>
    <MagneticButton variant="danger" onClick={() => {}}>
      Terminate run
    </MagneticButton>
  </div>
);

export const Disabled = () => (
  <div style={{ padding: "3rem" }}>
    <MagneticButton disabled onClick={() => {}}>
      Deploy agent
    </MagneticButton>
  </div>
);
