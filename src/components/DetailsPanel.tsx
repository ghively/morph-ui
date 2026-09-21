import type { ReactNode, ReactElement } from 'react';
import './DetailsPanel.css';

export interface ProfileBadge { id: string; label: string; solid?: boolean; }

export interface ProfileCardProps {
  title: ReactNode;
  identifier?: ReactNode;
  description?: ReactNode;
  avatar?: ReactNode;
  status?: { text: ReactNode; tone?: 'ok' | 'warn' | 'danger' };
  badges?: ProfileBadge[];
  toggles?: { id: string; label: string; on: boolean; onChange: (next: boolean) => void }[];
  chips?: string[];
  note?: ReactNode;
  eyebrow?: ReactNode;
  className?: string;
}

export function ProfileCard({
  title,
  identifier,
  description,
  avatar,
  status,
  badges,
  toggles,
  chips,
  note,
  eyebrow,
  className = ''
}: ProfileCardProps): ReactElement {
  const isRowLayout = !!avatar;

  const content = (
    <>
      <div data-strong="" data-lead="true">{title}</div>
      {identifier && <div data-num="" style={isRowLayout ? { overflow: "hidden", textOverflow: "ellipsis" } : undefined}>{identifier}</div>}
      
      {description && <div data-meta="" style={{ marginTop: isRowLayout ? 0 : "var(--s2)" }}>{description}</div>}
      
      {status && (
        <div data-meta="">
          <span 
            data-dot="" 
            data-tone={status.tone} 
            style={{ width: 6, height: 6, display: "inline-block", marginRight: 6 }} 
          />
          {status.text}
        </div>
      )}

      {((badges && badges.length > 0) || (toggles && toggles.length > 0)) && (
        <div style={{ display: "flex", gap: "var(--s2)", flexWrap: "wrap", marginTop: isRowLayout ? "var(--s3)" : "var(--s3)", margin: isRowLayout ? "var(--s3) 0" : undefined }}>
          {badges?.map((b) => (
            <span key={b.id} data-tag="" data-solid={b.solid ? "" : undefined}>{b.label}</span>
          ))}
          {toggles?.map((t) => (
            <button 
              key={t.id} 
              data-chip="" 
              data-state="" 
              data-on={String(t.on)} 
              aria-pressed={t.on} 
              onClick={() => t.onChange(!t.on)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {chips && (
        chips.length > 0 ? (
          <div style={{ display: "flex", gap: "var(--s1)", flexWrap: "wrap" }}>
            {chips.map((c, i) => (
              <span key={i} data-chip="">{c}</span>
            ))}
          </div>
        ) : (
          <div data-meta="">No capabilities published.</div>
        )
      )}

      {note && <div data-meta="" style={{ marginTop: "var(--s2)" }}>{note}</div>}
    </>
  );

  return (
    <>
      {eyebrow && <div data-eyebrow="">{eyebrow}</div>}
      <div 
        data-card="" 
        style={isRowLayout ? { display: "flex", gap: "var(--s4)", alignItems: "center" } : undefined} 
        className={className}
      >
        {isRowLayout ? (
          <>
            {avatar}
            <div style={{ minWidth: 0 }}>
              {content}
            </div>
          </>
        ) : (
          content
        )}
      </div>
    </>
  );
}

export interface DetailsPanelProps {
  kind: string;
  context?: string;
  onBack?: () => void;
  backLabel?: string;
  onClose: () => void;
  closeLabel?: string;
  icon?: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * DetailsPanel displays a right-edge details drawer.
 * Note: The invite form validation regex (`/^@[^:]+:.+$/`) and leave room confirmation
 * (`window.confirm`) are host behaviors that must be managed by the application.
 */
export function DetailsPanel({
  kind,
  context,
  onBack,
  backLabel = 'Back',
  onClose,
  closeLabel = 'Close details',
  icon,
  label,
  children,
  className = ''
}: DetailsPanelProps): ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} role="region" aria-label={label} className={className}>
      <div data-panehead="">
        {onBack ? (
          <button data-iconbtn="" onClick={onBack} aria-label={backLabel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents: 'none'}}><path d="m15 18-6-6 6-6"/></svg>
          </button>
        ) : icon ? (
          <div data-tile="" style={{ width: 26, height: 26 }}>
            {icon}
          </div>
        ) : null}
        
        <div style={{ minWidth: 0, flex: 1 }}>
          <div data-strong="">{kind}</div>
          <div data-meta="" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{context}</div>
        </div>
        
        <button data-iconbtn="" onClick={onClose} aria-label={closeLabel}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents: 'none'}}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <div style={{ flex: 1, overflow: "auto", padding: "var(--s3) var(--s4) var(--s5)" }}>
        {children}
      </div>
    </div>
  );
}
