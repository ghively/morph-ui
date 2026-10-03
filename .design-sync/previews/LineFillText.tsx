import { LineFillText } from "../../src/components/LineFillText";

// Static capture: shorten the draw/fill duration tokens on the host so the frame shows the
// settled (outlined + filled) state instead of an arbitrary mid-animation frame.
const STAGE = { padding: "2rem", maxWidth: 560, "--d3": "0ms", "--d5": "1ms" } as React.CSSProperties;

export const Default = () => (
  <div style={STAGE}>
    <LineFillText text="Morph UI" />
  </div>
);

export const SlowFill = () => (
  <div style={STAGE}>
    <LineFillText text="Shape-shift" fillDelay="0.05s" />
  </div>
);
