import { RefractionGlassPanel } from "./RefractionGlassPanel";

const body = (
  <div style={{ padding: "1.75rem", maxWidth: 360, lineHeight: 1.6 }}>
    <h3 style={{ margin: "0 0 0.5rem" }}>Session summary</h3>
    <p style={{ margin: 0, opacity: 0.85, fontSize: "0.9rem" }}>
      Four tasks completed, one deferred. The deferred task is waiting on a host that is
      currently refusing SSH connections.
    </p>
  </div>
);

export const Default = () => (
  <div
    style={{
      padding: "3rem",
      background: "linear-gradient(140deg, #3b5bdb, #0ca678)",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <RefractionGlassPanel>{body}</RefractionGlassPanel>
  </div>
);

export const StrongRefraction = () => (
  <div
    style={{
      padding: "3rem",
      background: "linear-gradient(140deg, #7048e8, #e8590c)",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <RefractionGlassPanel displacementScale={90}>{body}</RefractionGlassPanel>
  </div>
);
