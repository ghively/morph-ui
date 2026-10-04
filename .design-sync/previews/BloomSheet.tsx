import { useEffect, useRef, type ReactNode } from "react";
import { BloomSheet } from "../../src/components/BloomSheet";
import { TextField } from "../../src/components/TextField";
import { Button } from "../../src/components/Button";

// BloomSheet keeps its open state internally (no `open` prop); open it once on
// mount through its own trigger so the card shows the sheet, not the button.
function OpenOnMount({ children, minHeight = 460 }: { children: ReactNode; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    ref.current?.querySelector<HTMLElement>(".bloom-sheet-trigger")?.click();
  }, []);
  return <div ref={ref} style={{ minHeight }}>{children}</div>;
}

export const Default = () => (
  <OpenOnMount>
    <BloomSheet triggerLabel="Agent Settings" title="Agent Runtime Configuration">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p style={{ margin: 0, color: "var(--app-text, #eef1fc)" }}>
          Adjust active inference parameters and telemetry options for the agent node.
        </p>
        <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          <p style={{ margin: "0.25rem 0" }}>• Model: claude-sonnet (router default)</p>
          <p style={{ margin: "0.25rem 0" }}>• Temperature: 0.7</p>
          <p style={{ margin: "0.25rem 0" }}>• Context window: 200k tokens</p>
        </div>
      </div>
    </BloomSheet>
  </OpenOnMount>
);

export const InteractiveForm = () => (
  <OpenOnMount>
    <BloomSheet triggerLabel="New Deployment" title="Deploy Agent Instance">
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <TextField id="deploy-name" label="Instance name" defaultValue="worker-node-01" hint="Lowercase, digits and dashes." />
        <TextField id="deploy-region" label="Region" defaultValue="us-east-2" />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">Deploy</Button>
        </div>
      </form>
    </BloomSheet>
  </OpenOnMount>
);

export const LongScrollableContent = () => (
  <OpenOnMount minHeight={640}>
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
  </OpenOnMount>
);

export const CompactNotice = () => (
  <OpenOnMount>
    <BloomSheet triggerLabel="Connection Status" title="Network Topology Healthy">
      <p style={{ margin: 0 }}>
        All agent nodes are currently connected and responsive. Latency is within normal operating limits (&lt;12ms).
      </p>
    </BloomSheet>
  </OpenOnMount>
);
