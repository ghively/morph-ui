import { useCallback, useState } from 'react';
import type { ReactNode, ReactElement } from 'react';
import './SettingsPanel.css';

export interface SettingsSection { id: string; label: string; }

export interface SettingsPanelProps {
  sections: SettingsSection[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  railTitle?: string;
  title?: string;
  onClose?: () => void;
  closeLabel?: string;
  tablistLabel?: string;
  children: ReactNode;
  className?: string;
}

export function SettingsPanel({
  sections,
  activeSection,
  onSectionChange,
  railTitle = 'Settings',
  title,
  onClose,
  closeLabel = 'Close settings',
  tablistLabel = 'Settings sections',
  children,
  className = ''
}: SettingsPanelProps): ReactElement {
  const activeLabel = title ?? sections.find(s => s.id === activeSection)?.label ?? 'Settings';

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }} data-settingsbody="" className={className}>
      <div 
        data-subrail="" 
        data-stitch="" 
        data-settingsrail="" 
        role="tablist" 
        aria-label={tablistLabel} 
        style={{ flex: "none", padding: "var(--s6) var(--s3)", width: 206 }}
      >
        <div data-subrail-title="" style={{ padding: "0 var(--s3) var(--s5)", fontSize: "var(--t-prose)", fontWeight: 700 }}>
          {railTitle}
        </div>
        {sections.map((s) => {
          const active = s.id === activeSection;
          return (
            <button 
              key={s.id} 
              data-railitem="" 
              data-on={String(active)} 
              role="tab" 
              aria-selected={active} 
              onClick={() => onSectionChange(s.id)}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ height: 52, flex: "none", display: "flex", alignItems: "center", padding: "0 var(--s6)" }}>
          <div style={{ fontSize: "var(--t-title)", fontWeight: 700 }}>{activeLabel}</div>
          {onClose && (
            <button data-iconbtn="" data-push="" onClick={onClose} aria-label={closeLabel}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents: 'none'}}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>
        <div 
          role="tabpanel" 
          aria-label={activeLabel} 
          style={{ flex: 1, overflow: "auto", padding: "var(--s6)", display: "flex", flexDirection: "column", gap: "var(--s5)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface SettingRowProps {
  heading: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SettingRow({ heading, description, children, className = '' }: SettingRowProps): ReactElement {
  return (
    <div data-setrow="" className={className}>
      <div>
        <h4>{heading}</h4>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingRule(): ReactElement {
  return <div data-setrule="" />;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function timeToMinutes(value: string, fallback: number): number {
  if (!value) return fallback;
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return fallback;
  const h = parseInt(match[1]!, 10);
  const m = parseInt(match[2]!, 10);
  if (isNaN(h) || isNaN(m)) return fallback;
  return h * 60 + m;
}

export interface TimeRangeFieldProps {
  start: number;
  end: number;
  onStartChange: (minutes: number) => void;
  onEndChange: (minutes: number) => void;
  startLabel?: string;
  endLabel?: string;
  className?: string;
}

export function TimeRangeField({
  start,
  end,
  onStartChange,
  onEndChange,
  startLabel = 'Start',
  endLabel = 'End',
  className = ''
}: TimeRangeFieldProps): ReactElement {
  return (
    <div style={{ display: "flex", gap: "var(--s3)" }} className={className}>
      <input 
        data-field="" 
        type="time" 
        aria-label={startLabel} 
        value={minutesToTime(start)} 
        onChange={(e) => onStartChange(timeToMinutes(e.target.value, start))} 
      />
      <input 
        data-field="" 
        type="time" 
        aria-label={endLabel} 
        value={minutesToTime(end)} 
        onChange={(e) => onEndChange(timeToMinutes(e.target.value, end))} 
      />
    </div>
  );
}

export function usePersistedState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initial;
      return JSON.parse(item) as T;
    } catch {
      return initial;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
    setState(value);
  }, [key]);

  return [state, setValue];
}
