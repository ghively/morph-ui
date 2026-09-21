import type { ReactNode, ReactElement } from 'react';
import './PaneHeader.css';

export interface PaneHeaderStatus {
  tone: 'ok' | 'warn' | 'danger';
  label: string;
  detail?: string;
  indicator?: ReactNode;
  phase?: string;
}

export interface PaneHeaderAction {
  id: string;
  label: string;
  icon: ReactNode;
  shortLabel?: ReactNode;
  title?: string;
  ariaLabel?: string;
  active?: boolean;
  controls?: string;
  onSelect: () => void;
}

export interface PaneHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  subtitlePrefix?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  ornament?: ReactNode;
  status?: PaneHeaderStatus;
  actions?: PaneHeaderAction[];
  className?: string;
}

export function PaneHeader({
  title,
  subtitle,
  subtitlePrefix,
  onBack,
  backLabel,
  ornament,
  status,
  actions,
  className = ''
}: PaneHeaderProps): ReactElement {
  return (
    <div data-panehead="" className={className}>
      {onBack ? (
        <button data-iconbtn="" aria-label={backLabel} title={backLabel} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents: 'none'}}><path d="m15 18-6-6 6-6"/></svg>
        </button>
      ) : ornament ? (
        ornament
      ) : (
        <span data-mark="" style={{ width: 20, height: 20, opacity: 0.9, color: "var(--app-text)" }} />
      )}
      
      <div style={{ minWidth: 0, flex: 1, paddingRight: "var(--s2)" }}>
        <h1 data-swap="title" style={{ fontSize: "var(--t-title)", fontWeight: 700, letterSpacing: "var(--tk-snug)", lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
          {title}
        </h1>
        <div data-swap="sub" style={{ fontSize: "var(--t-num)", lineHeight: 1.25, color: "var(--app-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {subtitlePrefix && <span style={{ marginRight: 4 }}>{subtitlePrefix}</span>}
          {subtitle}
        </div>
      </div>
      
      {status ? (
        <div 
          data-headmeta="" 
          data-hidenarrow="" 
          data-tone={status.tone} 
          role="status" 
          aria-live="polite" 
          aria-label={`Status: ${status.label}`} 
          data-connection={status.phase}
        >
          {status.detail && <span data-num="">{status.detail}</span>}
          {status.indicator}
          <span data-meta="">{status.label}</span>
        </div>
      ) : null}
      
      {actions && actions.length > 0 ? (
        <div data-headcluster="">
          {actions.map((act) => (
            <button 
              key={act.id} 
              data-hb="" 
              data-on={String(!!act.active)} 
              aria-pressed={act.active} 
              aria-expanded={act.controls ? act.active : undefined} 
              aria-controls={act.controls} 
              title={act.title ?? act.label} 
              aria-label={act.ariaLabel ?? act.label}
              onClick={act.onSelect}
            >
              {act.icon}
              {act.shortLabel && <span data-hbl="">{act.shortLabel}</span>}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
