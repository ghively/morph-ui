import type { StoryDefault, Story } from '@ladle/react';
import type { ReactNode } from "react";
import { DeviceFrame } from "./DeviceFrame";

function MockMobileContent({
  title = "Dashboard",
  subtitle = "System metrics & status",
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "36px 16px 20px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#f8fafc",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
          09:41
        </span>
        <div style={{ display: "flex", gap: "6px", fontSize: "11px", color: "#94a3b8" }}>
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>{title}</h2>
        {subtitle && (
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {children ?? (
          <>
            <div
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                borderRadius: "16px",
                padding: "16px",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              }}
            >
              <div style={{ fontSize: "11px", opacity: 0.8 }}>Current Balance</div>
              <div style={{ fontSize: "24px", fontWeight: 700, margin: "6px 0" }}>
                $14,850.00
              </div>
              <div style={{ fontSize: "11px", color: "#86efac" }}>+12.4% this month</div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                Active Agents
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "#94a3b8",
                }}
              >
                <span>Crawler Bot</span>
                <span style={{ color: "#34d399" }}>Running</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                System Status
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "#94a3b8",
                }}
              >
                <span>Memory Load</span>
                <span>42%</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "space-around",
          fontSize: "11px",
          color: "#94a3b8",
        }}
      >
        <span style={{ color: "#60a5fa", fontWeight: 600 }}>Home</span>
        <span>Stats</span>
        <span>Settings</span>
      </div>
    </div>
  );
}

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <DeviceFrame>
      <MockMobileContent />
    </DeviceFrame>
  </div>
);

export const WithoutNotch = () => (
  <div style={{ padding: "2rem" }}>
    <DeviceFrame showNotch={false}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "20px 16px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#f8fafc",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>
            10:15
          </span>
          <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 600 }}>
            Edge-to-Edge
          </span>
        </div>
        <div
          style={{
            height: "140px",
            background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "16px",
            boxSizing: "border-box",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
            Notchless Viewport
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.8)" }}>
            Full vertical screen clearance
          </div>
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "12px",
            fontSize: "12px",
            color: "#cbd5e1",
            lineHeight: 1.5,
          }}
        >
          Camera cutout and notch hardware accents are hidden, providing maximum edge-to-edge canvas real estate.
        </div>
      </div>
    </DeviceFrame>
  </div>
);

export const CustomWidth = () => (
  <div style={{ padding: "2rem" }}>
    <DeviceFrame width={400}>
      <MockMobileContent
        title="Expanded Viewport"
        subtitle="Wide 400px phablet screen form factor"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "12px",
              padding: "12px",
            }}
          >
            <div style={{ fontSize: "11px", color: "#93c5fd" }}>Throughput</div>
            <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "4px" }}>
              2.4 GB/s
            </div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(168, 85, 247, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "12px",
              padding: "12px",
            }}
          >
            <div style={{ fontSize: "11px", color: "#d8b4fe" }}>Latency</div>
            <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "4px" }}>
              14 ms
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "14px",
            marginTop: "4px",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
            Dual-Column Optimization
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.4 }}>
            Demonstrates larger device frames scaling naturally with responsive layouts.
          </div>
        </div>
      </MockMobileContent>
    </DeviceFrame>
  </div>
);

export const ScrollableContent = () => (
  <div style={{ padding: "2rem" }}>
    <DeviceFrame>
      <div
        style={{
          padding: "36px 16px 20px 16px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: 700 }}>Activity Stream</div>
        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
          Scroll down to view history
        </div>
        {[
          { time: "Just now", text: "Deployment #482 finished successfully", tag: "Deploy" },
          { time: "4m ago", text: "Security policy audit passed with 0 warnings", tag: "Audit" },
          { time: "18m ago", text: "Replica pool auto-scaled to 8 instances", tag: "Scale" },
          { time: "1h ago", text: "Database snapshot backup completed", tag: "Backup" },
          { time: "2h ago", text: "SSL certificate automatically renewed", tag: "Security" },
          { time: "5h ago", text: "Node cluster synchronized with upstream", tag: "Sync" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "#94a3b8",
                marginBottom: "4px",
              }}
            >
              <span>{item.tag}</span>
              <span>{item.time}</span>
            </div>
            <div style={{ fontSize: "12px", color: "#e2e8f0" }}>{item.text}</div>
          </div>
        ))}
      </div>
    </DeviceFrame>
  </div>
);
