import { FluidWorkspaceBoard } from "./FluidWorkspaceBoard";
import type { FluidWorkspaceBoardItem } from "./FluidWorkspaceBoard";

// The board item already pads its body and sets body type; the panel adds
// none of its own so the copy lines up with the card title.
function panel(text: string) {
  return <div>{text}</div>;
}

const items: FluidWorkspaceBoardItem[] = [
  { id: "queue", title: "Task Queue", node: panel("12 queued · 3 running · 1 blocked on approval.") },
  { id: "telemetry", title: "Telemetry", node: panel("p99 latency 42ms, error rate 0.03% over the last hour.") },
  { id: "agents", title: "Agent Roster", node: panel("Hermes, Jules, and three Claude executors are online.") },
  { id: "notes", title: "Session Notes", node: panel("Retry backoff landed; deploy to gh-media still blocked.") },
];

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <FluidWorkspaceBoard items={items} onReorder={() => {}} />
  </div>
);

export const Compact = () => (
  <div style={{ padding: "2rem" }}>
    <FluidWorkspaceBoard
      items={items}
      density="compact"
      defaultOrder={["telemetry", "queue", "notes", "agents"]}
      onReorder={() => {}}
    />
  </div>
);
