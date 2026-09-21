import { BloomSheet } from "./BloomSheet";

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <BloomSheet triggerLabel="Agent Settings" title="Agent Runtime Configuration">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ margin: 0, color: "var(--app-text, #eef1fc)" }}>
          Adjust active inference parameters and telemetry options for the agent node.
        </p>
        <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          <p style={{ margin: "0.25rem 0" }}>• Model: Claude 3.5 Sonnet</p>
          <p style={{ margin: "0.25rem 0" }}>• Temperature: 0.7</p>
          <p style={{ margin: "0.25rem 0" }}>• Context window: 200k tokens</p>
        </div>
      </div>
    </BloomSheet>
  </div>
);

export const InteractiveForm = () => (
  <div style={{ padding: "2rem" }}>
    <BloomSheet triggerLabel="New Deployment" title="Deploy Agent Instance">
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.85rem" }}>
            Instance Name
          </label>
          <input
            type="text"
            defaultValue="worker-node-01"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid rgba(150, 175, 255, 0.3)",
              background: "rgba(0, 0, 0, 0.2)",
              color: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: "var(--app-blue, #6c9cf0)",
              border: "none",
              color: "#080c2c",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Deploy
          </button>
        </div>
      </form>
    </BloomSheet>
  </div>
);

export const LongScrollableContent = () => (
  <div style={{ padding: "2rem" }}>
    <BloomSheet triggerLabel="View Audit Log" title="System Audit Trail">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ margin: 0 }}>
          Comprehensive activity and event logs recorded across all active clusters.
        </p>
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            style={{
              padding: "0.5rem 0.75rem",
              borderLeft: "2px solid var(--app-blue, #6c9cf0)",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
              Event #{100 + index + 1} &middot; Checkpoint Synchronized
            </div>
            <div style={{ fontSize: "0.75rem", opacity: 0.75, marginTop: "0.25rem" }}>
              State updated with gateway cluster at node-us-east-2.
            </div>
          </div>
        ))}
      </div>
    </BloomSheet>
  </div>
);

export const CompactNotice = () => (
  <div style={{ padding: "2rem" }}>
    <BloomSheet triggerLabel="Connection Status" title="Network Topology Healthy">
      <p style={{ margin: 0 }}>
        All agent nodes are currently connected and responsive. Latency is within normal operating limits (&lt;12ms).
      </p>
    </BloomSheet>
  </div>
);
