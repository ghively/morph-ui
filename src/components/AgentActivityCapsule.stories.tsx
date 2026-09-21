import type { StoryDefault, Story } from '@ladle/react';
import { AgentActivityCapsule } from "./AgentActivityCapsule";

const details = [
  "Read src/gateway/router.ts (412 lines)",
  "Patched retry backoff to exponential with jitter",
  "Ran vitest — 248 passed, 0 failed",
];

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 560 }}>
    <AgentActivityCapsule
      state="summary"
      agent="Hermes"
      activity="Refactoring gateway retry policy"
      count={3}
      details={details}
      progress={0.45}
      onExpand={() => {}}
      onCollapse={() => {}}
    />
  </div>
);

export const Expanded = () => (
  <div style={{ padding: "2rem", maxWidth: 560 }}>
    <AgentActivityCapsule
      state="expanded"
      agent="Hermes"
      activity="Refactoring gateway retry policy"
      count={3}
      details={details}
      progress={0.78}
      onCollapse={() => {}}
    />
  </div>
);

export const Failed = () => (
  <div style={{ padding: "2rem", maxWidth: 560 }}>
    <AgentActivityCapsule
      state="failed"
      agent="Hermes"
      activity="Deploy to gh-media stalled"
      count={1}
      details={["ssh: connect to host gh-media port 22: connection refused"]}
      onExpand={() => {}}
    />
  </div>
);
