import type { ReactNode, ReactElement } from 'react';
import './SidePanel.css';

export interface SidePanelProps {
  open: boolean;
  slot: 'drawer' | 'left';
  accent?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  headerAction?: { icon: ReactNode; label: string; title?: string; onSelect: () => void };
  onClose: () => void;
  closeLabel?: string;
  closeTitle?: string;
  bodyId?: string;
  bodyOverflow?: 'auto' | 'hidden';
  headerPadding?: string;
  iconMargin?: string;
  bodyPadding?: string;
  children: ReactNode;
  className?: string;
}

export function SidePanel({
  open,
  slot,
  accent = 'blue',
  title,
  subtitle,
  icon,
  onBack,
  backLabel = 'Back',
  headerAction,
  onClose,
  closeLabel = 'Collapse',
  closeTitle,
  bodyId,
  bodyOverflow = 'auto',
  headerPadding,
  iconMargin,
  bodyPadding,
  children,
  className = ''
}: SidePanelProps): ReactElement {
  
  // Resolve defaults correctly based on source usage, or use prop overrides
  const padH = headerPadding ?? (slot === 'drawer' ? "0 var(--s2) 0 var(--s5)" : "0 var(--s2) 0 var(--s2)");
  const iMargin = iconMargin ?? (slot === 'left' && !onBack ? "var(--s3)" : "0");
  const padB = bodyPadding ?? (slot === 'drawer' ? "0 0 var(--s4)" : undefined);

  return (
    <div 
      data-leftpanel="" 
      data-slot={slot} 
      data-open={String(open)} 
      data-sec={accent} 
      aria-hidden={!open} 
      inert={!open ? true : undefined}
      className={className}
    >
      <div style={{ height: "var(--h-bar)", flex: "none", display: "flex", alignItems: "center", gap: "var(--s3)", padding: padH }}>
        {onBack ? (
          <button data-iconbtn="" onClick={onBack} aria-label={backLabel} title={backLabel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents: 'none'}}><path d="m15 18-6-6 6-6"/></svg>
          </button>
        ) : icon ? (
          <div data-tile="" style={{ width: 26, height: 26, marginLeft: iMargin }}>
            {icon}
          </div>
        ) : null}

        <div style={{ minWidth: 0, flex: 1 }}>
          <div data-strong="" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: "var(--t-meta)", color: "var(--app-rail-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>
          )}
        </div>

        {headerAction && (
          <button 
            data-iconbtn="" 
            onClick={headerAction.onSelect} 
            title={headerAction.title ?? headerAction.label} 
            aria-label={headerAction.label} 
            style={{ color: "var(--app-rail-dim)" }}
          >
            {headerAction.icon}
          </button>
        )}

        <button 
          data-iconbtn="" 
          onClick={onClose} 
          title={closeTitle ?? closeLabel} 
          aria-label={closeLabel} 
          aria-expanded={open} 
          aria-controls={bodyId} 
          style={{ color: "var(--app-rail-dim)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents: 'none'}}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div 
        id={bodyId} 
        style={{ flex: 1, minHeight: 0, overflow: bodyOverflow, padding: padB, display: "flex", flexDirection: "column" }}
      >
        {children}
      </div>
    </div>
  );
}
