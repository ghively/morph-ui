import { useApp } from "../../app/context";
import { usePrefs } from "../../app/prefs";
import { useTheme } from "../../theme/context";
import { Seg, Sheet, Switch, useToast } from "../../components/primitives";
import { I } from "../../components/icons";
import { PushSettings, pausePush } from "../../push/PushSettings";

const TABS = [
  ["general", "General"],
  ["interface", "Interface"],
  ["notifications", "Notifications"],
  ["about", "About"],
] as const;

export function SettingsSheet({ tab, onTab, onClose }: { tab: string; onTab: (t: string) => void; onClose: () => void }) {
  const { prefs, setPref } = usePrefs();
  const { config, manager } = useApp();
  const { theme, themes, setThemeId, brand } = useTheme();
  const toast = useToast();
  const title = TABS.find(([k]) => k === tab)?.[1] ?? "General";
  return (
    <Sheet label="Settings" onClose={onClose} width={780} height={560}>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }} data-settingsbody="">
        <div data-subrail="" data-stitch="" data-settingsrail="" role="tablist" aria-label="Settings sections" style={{ flex: "none", padding: "var(--s6) var(--s3)", width: 206 }}>
          <div data-subrail-title="" style={{ padding: "0 var(--s3) var(--s5)", fontSize: "var(--t-prose)", fontWeight: 700 }}>
            Settings
          </div>
          {TABS.map(([k, label]) => (
            <button key={k} data-railitem="" data-on={String(tab === k)} role="tab" aria-selected={tab === k} onClick={() => onTab(k)}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ height: 52, flex: "none", display: "flex", alignItems: "center", padding: "0 var(--s6)" }}>
            <div style={{ fontSize: "var(--t-title)", fontWeight: 700 }}>{title}</div>
            <button data-iconbtn="" onClick={onClose} data-push="" aria-label="Close settings">
              {I.close()}
            </button>
          </div>
          <div role="tabpanel" aria-label={title} style={{ flex: 1, overflow: "auto", padding: "var(--s6)", display: "flex", flexDirection: "column", gap: "var(--s5)" }}>
            {tab === "general" ? (
              <>
                <div data-setrow="">
                  <div>
                    <h4>Send with Enter</h4>
                    <p>{prefs.sendEnter ? "Shift + Enter inserts a newline" : "⌘/Ctrl + Enter sends"}</p>
                  </div>
                  <Switch on={prefs.sendEnter} onChange={(v) => setPref("sendEnter", v)} label="Send with Enter" />
                </div>
                <div data-setrule="" />
                <div data-setrow="">
                  <div>
                    <h4>Sign out</h4>
                    <p>Clears this browser's session, cache and keys</p>
                  </div>
                  <button data-btn="" data-state="" data-push="" onClick={() => void manager.logout()}>
                    Sign out
                  </button>
                </div>
              </>
            ) : null}
            {tab === "interface" ? (
              <>
                <div data-setrow="">
                  <div>
                    <h4>Skin</h4>
                    <p>{theme.description}</p>
                  </div>
                  <Seg
                    label="Skin"
                    value={theme.id}
                    onChange={setThemeId}
                    options={themes.map((t) => ({ value: t.id, label: t.label }))}
                  />
                </div>
                <div data-setrule="" />
                <div data-setrow="">
                  <div>
                    <h4>Theme</h4>
                    <p>Light or dark — independent of the skin</p>
                  </div>
                  <Seg label="Theme" value={prefs.theme} onChange={(v) => setPref("theme", v)} options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]} />
                </div>
                <div data-setrule="" />
                <div data-setrow="">
                  <div>
                    <h4>Density</h4>
                    <p>Tighter rails and gutters</p>
                  </div>
                  <Seg label="Density" value={prefs.density} onChange={(v) => setPref("density", v)} options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]} />
                </div>
                <div data-setrule="" />
                <div data-setrow="">
                  <div>
                    <h4>Reduce motion</h4>
                    <p>Also follows your system setting</p>
                  </div>
                  <Switch on={prefs.reduceMotion} onChange={(v) => setPref("reduceMotion", v)} label="Reduce motion" />
                </div>
                <div data-setrule="" />
                <div data-setrow="">
                  <div>
                    <h4>Pin the dock</h4>
                    <p>Keep rooms visible in the rail</p>
                  </div>
                  <Switch on={prefs.pinned} onChange={(v) => setPref("pinned", v)} label="Pin the dock" />
                </div>
              </>
            ) : null}
            {tab === "notifications" ? (
              <div data-setrow="">
                <div>
                  <h4>Browser notifications</h4>
                  <p>Mentions and direct messages while this tab is in the background. Permission: {typeof Notification === "undefined" ? "unsupported" : Notification.permission}</p>
                </div>
                <Switch
                  on={prefs.notifications && typeof Notification !== "undefined" && Notification.permission === "granted"}
                  onChange={async (v) => {
                    if (!v) {
                      setPref("notifications", false);
                      await pausePush(manager).catch(() => {});
                      return;
                    }
                    if (typeof Notification === "undefined") return toast("Not supported", "this browser", "danger");
                    const p = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
                    setPref("notifications", p === "granted");
                    if (p !== "granted") toast("Permission denied", "browser settings", "danger");
                  }}
                  label="Browser notifications"
                />
              </div>
            ) : null}
            {tab === "notifications" ? <PushSettings /> : null}
            {tab === "about" ? (
              <div data-card="">
                <div data-strong="">{brand.productName}</div>
                <div data-meta="">
                  Agent-first Matrix workspace · {config.fixtureMode ? "FIXTURE MODE — sample data" : "live Matrix data"}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
