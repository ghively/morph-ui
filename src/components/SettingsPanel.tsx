import './SettingsPanel.css';
import { minutesToTime, timeToMinutes } from "./layout.shared";
import type { SettingsPanelProps, SettingRowProps, TimeRangeFieldProps } from './layout.shared';

export function SettingsPanel({ sections, activeSection, onSectionChange, railTitle = 'Settings', title, onClose, closeLabel = 'Close settings', tablistLabel = 'Settings sections', children, className = '' }: SettingsPanelProps) {
  const activeLabel = title ?? sections.find(s => s.id === activeSection)?.label ?? 'Settings';
  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }} data-settingsbody="" className={className}>
      <div data-subrail="" data-stitch="" data-settingsrail="" role="tablist" aria-label={tablistLabel} style={{ flex: "none", padding: "var(--s6) var(--s3)", width: 206 }}>
        <div data-subrail-title="" style={{ padding: "0 var(--s3) var(--s5)", fontSize: "var(--t-prose)", fontWeight: 700 }}>{railTitle}</div>
        {sections.map((s) => <button key={s.id} data-railitem="" data-on={String(s.id === activeSection)} role="tab" aria-selected={s.id === activeSection} onClick={() => onSectionChange(s.id)}>{s.label}</button>)}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ height: 52, flex: "none", display: "flex", alignItems: "center", padding: "0 var(--s6)" }}>
          <div style={{ fontSize: "var(--t-title)", fontWeight: 700 }}>{activeLabel}</div>
          {onClose && <button data-iconbtn="" data-push="" onClick={onClose} aria-label={closeLabel}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents: 'none'}}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>}
        </div>
        <div role="tabpanel" aria-label={activeLabel} style={{ flex: 1, overflow: "auto", padding: "var(--s6)", display: "flex", flexDirection: "column", gap: "var(--s5)" }}>{children}</div>
      </div>
    </div>
  );
}

export function SettingRow({ heading, description, children, className = '' }: SettingRowProps) {
  return <div data-setrow="" className={className}><div><h4>{heading}</h4>{description && <p>{description}</p>}</div>{children}</div>;
}
export function SettingRule() { return <div data-setrule="" />; }
export function TimeRangeField({ start, end, onStartChange, onEndChange, startLabel = 'Start', endLabel = 'End', className = '' }: TimeRangeFieldProps) {
  return (
    <div style={{ display: "flex", gap: "var(--s3)" }} className={className}>
      <input data-field="" type="time" aria-label={startLabel} value={minutesToTime(start)} onChange={(e) => onStartChange(timeToMinutes(e.target.value, start))} />
      <input data-field="" type="time" aria-label={endLabel} value={minutesToTime(end)} onChange={(e) => onEndChange(timeToMinutes(e.target.value, end))} />
    </div>
  );
}
export type { SettingsSection, SettingsPanelProps, SettingRowProps, TimeRangeFieldProps } from './layout.shared';
export { minutesToTime, timeToMinutes, usePersistedState } from './layout.shared';
