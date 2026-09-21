import { FeatureChipHopper } from "./FeatureChipHopper";

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <FeatureChipHopper
      chips={[
        { id: "copilot", content: "🤖 Autonomous Copilot" },
        { id: "context", content: "⚡ Infinite Context Window" },
        { id: "vector-search", content: "🔍 Hybrid Vector Search" },
        { id: "security", content: "🔒 Zero-Knowledge Security" },
      ]}
    />
  </div>
);

export const FastPaced = () => (
  <div style={{ padding: "2rem" }}>
    <FeatureChipHopper
      intervalMs={1000}
      chips={[
        { id: "fetch", content: "📥 Fetching repository..." },
        { id: "index", content: "⚙️ Indexing symbols..." },
        { id: "analyze", content: "🧠 Analyzing dependencies..." },
        { id: "ready", content: "✨ Ready for prompts" },
      ]}
    />
  </div>
);

export const SingleChip = () => (
  <div style={{ padding: "2rem" }}>
    <FeatureChipHopper
      chips={[
        { id: "single-static", content: "🛡️ Enterprise Security Active" },
      ]}
    />
  </div>
);

export const RichBadges = () => (
  <div style={{ padding: "2rem" }}>
    <FeatureChipHopper
      intervalMs={2200}
      chips={[
        {
          id: "agent-ready",
          content: (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span>Core Agent</span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: "rgba(34, 197, 94, 0.15)",
                  color: "#22c55e",
                  fontWeight: 600,
                }}
              >
                ONLINE
              </span>
            </span>
          ),
        },
        {
          id: "agent-busy",
          content: (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
              <span>Code Synthesizer</span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  fontWeight: 600,
                }}
              >
                BUSY
              </span>
            </span>
          ),
        },
        {
          id: "agent-eval",
          content: (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7" }} />
              <span>Test Evaluator</span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: "rgba(168, 85, 247, 0.15)",
                  color: "#c084fc",
                  fontWeight: 600,
                }}
              >
                VERIFYING
              </span>
            </span>
          ),
        },
      ]}
    />
  </div>
);

export const SlowInterval = () => (
  <div style={{ padding: "2rem" }}>
    <FeatureChipHopper
      intervalMs={4000}
      chips={[
        { id: "multimodal", content: "🎨 Real-time Multimodal Canvas & Stream" },
        { id: "collab", content: "👥 Multiplayer State Synchronization" },
        { id: "analytics", content: "📊 Deep Diagnostic Telemetry & Traces" },
      ]}
    />
  </div>
);
