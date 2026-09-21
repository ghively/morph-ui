import { FollowCursorLabel } from "./FollowCursorLabel";

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <FollowCursorLabel label="Open project" targetSelector=".follow-cursor-target" />
    <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(2, 1fr)" }}>
      {["Aurora", "Meridian", "Halcyon", "Vesper"].map((name) => (
        <div
          key={name}
          className="follow-cursor-target"
          style={{
            height: 140,
            borderRadius: 14,
            border: "1px solid rgba(150, 175, 255, 0.25)",
            background: "rgba(255, 255, 255, 0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "none",
          }}
        >
          {name}
        </div>
      ))}
    </div>
  </div>
);
