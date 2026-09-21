import type { CSSProperties } from "react";
import { GlassEnvelopeCard } from "./GlassEnvelopeCard";

const cardStyle = (accentColor: string): CSSProperties => ({
  width: "100%",
  height: "100%",
  padding: "16px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
  borderTop: `2px solid ${accentColor}`,
  fontFamily: "system-ui, -apple-system, sans-serif",
  color: "#f8fafc",
});

export const Default = () => {
  const roadmapCards = [
    <div key="card-1" style={cardStyle("#38bdf8")}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Milestone 1
          </span>
          <span style={{ fontSize: "10px", color: "#94a3b8" }}>v1.0</span>
        </div>
        <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "6px", color: "#f8fafc" }}>
          Core Protocol
        </div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0", lineHeight: 1.4 }}>
          Reactive stream runtime with async state machine primitives.
        </p>
      </div>
      <div style={{ fontSize: "10px", color: "#34d399", fontWeight: 600 }}>
        Completed
      </div>
    </div>,

    <div key="card-2" style={cardStyle("#a855f7")}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Milestone 2
          </span>
          <span style={{ fontSize: "10px", color: "#94a3b8" }}>v1.2</span>
        </div>
        <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "6px", color: "#f8fafc" }}>
          Glass Canvas
        </div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0", lineHeight: 1.4 }}>
          Dynamic shader backdrop and spatial depth envelopes.
        </p>
      </div>
      <div style={{ fontSize: "10px", color: "#60a5fa", fontWeight: 600 }}>
        In Progress
      </div>
    </div>,

    <div key="card-3" style={cardStyle("#f59e0b")}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Milestone 3
          </span>
          <span style={{ fontSize: "10px", color: "#94a3b8" }}>v2.0</span>
        </div>
        <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "6px", color: "#f8fafc" }}>
          Agent Swarm
        </div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0", lineHeight: 1.4 }}>
          Decentralized consensus protocol and peer memory replication.
        </p>
      </div>
      <div style={{ fontSize: "10px", color: "#f59e0b", fontWeight: 600 }}>
        Planned
      </div>
    </div>,
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <GlassEnvelopeCard
        envelopeContent={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Project Roadmap
            </span>
            <span style={{ fontSize: "11px", opacity: 0.75 }}>
              Click or press Enter to inspect
            </span>
          </div>
        }
        cards={roadmapCards}
      />
    </div>
  );
};

export const SingleCard = () => {
  const singleCard = [
    <div
      key="single"
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
        borderTop: "2px solid #818cf8",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#f8fafc",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Security Pass
          </span>
          <span style={{ fontSize: "10px", color: "#34d399", fontWeight: 600 }}>Active</span>
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "8px" }}>
          Level 5 Clearance
        </div>
        <p style={{ fontSize: "11px", color: "#cbd5e1", margin: "6px 0 0", lineHeight: 1.4 }}>
          Authorized for autonomous neural agent execution and kernel telemetry access.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          color: "#94a3b8",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "8px",
        }}
      >
        <span>Token: #8F9A-402</span>
        <span>Expires: 2027</span>
      </div>
    </div>,
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <GlassEnvelopeCard
        envelopeContent={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Encrypted Pass
            </span>
            <span style={{ fontSize: "11px", opacity: 0.75 }}>
              Tap to decrypt credentials
            </span>
          </div>
        }
        cards={singleCard}
      />
    </div>
  );
};

export const MultiCardDeck = () => {
  const deckCards = [
    <div key="card-1" style={cardStyle("#38bdf8")}>
      <div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#38bdf8" }}>01 / SYNTAX</div>
        <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>AST Parser</div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>High-throughput TypeScript tree traversal.</p>
      </div>
      <span style={{ fontSize: "10px", color: "#38bdf8" }}>Ready</span>
    </div>,
    <div key="card-2" style={cardStyle("#34d399")}>
      <div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#34d399" }}>02 / TEST</div>
        <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>Vitest Runner</div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>Isolated sandbox unit verification.</p>
      </div>
      <span style={{ fontSize: "10px", color: "#34d399" }}>Passing</span>
    </div>,
    <div key="card-3" style={cardStyle("#fbbf24")}>
      <div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#fbbf24" }}>03 / LINT</div>
        <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>ESLint Core</div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>Strict type-aware code hygiene checks.</p>
      </div>
      <span style={{ fontSize: "10px", color: "#fbbf24" }}>Verified</span>
    </div>,
    <div key="card-4" style={cardStyle("#a855f7")}>
      <div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#a855f7" }}>04 / SHADER</div>
        <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>Canvas FX</div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>GPU-accelerated glassmorphism effects.</p>
      </div>
      <span style={{ fontSize: "10px", color: "#a855f7" }}>60 FPS</span>
    </div>,
    <div key="card-5" style={cardStyle("#f43f5e")}>
      <div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#f43f5e" }}>05 / SWARM</div>
        <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>Subagent Sync</div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>Peer event routing and state broadcast.</p>
      </div>
      <span style={{ fontSize: "10px", color: "#f43f5e" }}>Synced</span>
    </div>,
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <GlassEnvelopeCard
        envelopeContent={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Capability Deck
            </span>
            <span style={{ fontSize: "11px", opacity: 0.75 }}>
              5 module cards fanned on open
            </span>
          </div>
        }
        cards={deckCards}
      />
    </div>
  );
};

export const NotificationStack = () => {
  const alerts = [
    <div key="alert-1" style={cardStyle("#ef4444")}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#ef4444", textTransform: "uppercase" }}>High Priority</span>
          <span style={{ fontSize: "10px", color: "#94a3b8" }}>1m ago</span>
        </div>
        <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "6px" }}>Memory Spike</div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0", lineHeight: 1.4 }}>
          Node cluster memory consumption reached 89% threshold.
        </p>
      </div>
      <div style={{ fontSize: "10px", color: "#f87171", fontWeight: 600 }}>Investigate</div>
    </div>,
    <div key="alert-2" style={cardStyle("#38bdf8")}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>Info</span>
          <span style={{ fontSize: "10px", color: "#94a3b8" }}>14m ago</span>
        </div>
        <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "6px" }}>Deployment Ready</div>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0", lineHeight: 1.4 }}>
          Release candidate v1.2.0 passed all smoke test suites.
        </p>
      </div>
      <div style={{ fontSize: "10px", color: "#38bdf8", fontWeight: 600 }}>Promote</div>
    </div>,
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <GlassEnvelopeCard
        envelopeContent={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Alert Dispatch
            </span>
            <span style={{ fontSize: "11px", opacity: 0.75 }}>
              2 system notices pending review
            </span>
          </div>
        }
        cards={alerts}
      />
    </div>
  );
};
