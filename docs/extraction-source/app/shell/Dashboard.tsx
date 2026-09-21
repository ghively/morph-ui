import { useEffect } from "react";
import { AuditScreen } from "../../features/audit/AuditScreen";
import { LibraryScreen } from "../../features/library/LibraryScreen";
import { AdminScreen } from "../../features/admin/AdminScreen";
import { ProvidersScreen } from "../../features/admin/ProvidersScreen";

const TABS = [
  ["audit", "Audit"],
  ["library", "Library"],
  ["admin", "Admin"],
  ["providers", "Providers"],
] as const;

/** The dashboard drawer comes down from the top edge (docs/01: glanceable sections). */
export function Dashboard({ tab, onTab, onClose }: { tab: string; onTab: (t: string) => void; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div data-scrim="" onClick={onClose} style={{ position: "fixed", inset: 0, background: "var(--scrim-soft)", zIndex: 75, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0 var(--s6)" }}>
      <div data-sheet="" data-drawer="down" data-drawerpanel="" data-pane="" role="dialog" aria-modal="true" aria-label="Dashboard" onClick={(e) => e.stopPropagation()} style={{ marginTop: "var(--gap)", width: 1100, maxWidth: "100%", height: "78vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "none", display: "flex", alignItems: "center", gap: "var(--s4)", padding: "14px var(--gut) 10px" }}>
          <div data-tabstrip="" role="tablist" aria-label="Dashboard sections">
            {TABS.map(([k, label]) => (
              <button key={k} type="button" data-tab="" role="tab" aria-selected={tab === k} onClick={() => onTab(k)}>
                {label}
              </button>
            ))}
          </div>
          <button data-iconbtn="" data-push="" onClick={onClose} aria-label="Close dashboard">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }} role="tabpanel">
          {tab === "library" ? <LibraryScreen /> : tab === "admin" ? <AdminScreen /> : tab === "providers" ? <ProvidersScreen /> : <AuditScreen />}
        </div>
      </div>
    </div>
  );
}
