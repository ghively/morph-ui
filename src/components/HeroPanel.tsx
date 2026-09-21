import type { ReactNode } from 'react';
import './HeroPanel.css';

export interface HeroChip {
  id: string;
  label: string;
  /** Trailing solid tag, e.g. a runtime badge. */
  tag?: string;
  /** Rendered before the label, e.g. '# '. */
  prefix?: string;
  onSelect: () => void;
}

export interface HeroChipGroup {
  id: string;
  /** Eyebrow above the group. */
  label: string;
  chips: HeroChip[];
  /** Stagger the chips' entry animation. */
  stagger?: boolean;
}

export interface HeroPanelProps {
  title: ReactNode;
  /** Sub-line under the title. */
  description?: ReactNode;
  /** 'mark' = the big gradient mark tile (Launcher/Login). 'tile' = the small status tile (Centered). */
  ornament?: 'mark' | 'tile' | 'none';   // default 'mark'
  /** With ornament='tile': pulsing dot. */
  busy?: boolean;
  groups?: HeroChipGroup[];
  /** Buttons rendered at the bottom, unwrapped. */
  actions?: ReactNode;
  /** Max width of the inner column. Default 740 ('mark') / 440 (Login) — caller-set. */
  maxWidth?: number;
  className?: string;
}

export function HeroPanel({
  title,
  description,
  ornament = 'mark',
  busy,
  groups,
  actions,
  maxWidth = 740,
  className = ''
}: HeroPanelProps) {
  return (
    <div className={`hero-panel ${className}`}>
      <div className="hero-panel-content" style={{ maxWidth }}>
        
        {/* Entry wrapper */}
        <div data-enter="">
          
          {/* Ornament */}
          {ornament === 'mark' && (
            <div data-grow="">
              <span data-sheen="" />
              <span data-mark="" />
            </div>
          )}
          {ornament === 'tile' && (
            <div data-empty="" role={busy ? "status" : undefined} aria-live="polite">
              <div data-herotile="">
                <span data-dot="" data-live={busy ? "" : undefined} />
              </div>
            </div>
          )}

          {/* Title */}
          {ornament === 'mark' || ornament === 'none' ? (
            <h1 className="hero-title-mark">{title}</h1>
          ) : (
            <div data-heroeyebrow="">{title}</div>
          )}
          
          {/* Description */}
          {description && (
            <div className="hero-description">{description}</div>
          )}

        </div>

        {/* Chip Groups */}
        {groups && groups.length > 0 && (
          <div>
            {groups.map((g, index) => (
              <div key={g.id}>
                <div 
                  data-heroeyebrow="" 
                  style={{ 
                    justifyContent: "center", 
                    marginBottom: "var(--s3)",
                    display: "flex",
                    margin: index > 0 ? "var(--s6) 0 var(--s3)" : "0 0 var(--s3)"
                  }}
                >
                  {g.label}
                </div>
                <div data-stagger="" data-enter={g.stagger ? "3" : undefined}>
                  {g.chips.map(chip => (
                    <button 
                      key={chip.id} 
                      type="button" 
                      data-herochip="" 
                      data-state="" 
                      onClick={chip.onSelect}
                    >
                      {chip.prefix}{chip.label}
                      {chip.tag && (
                        <span data-tag="" data-solid="">{chip.tag}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className={`hero-actions ${groups && groups.length > 0 ? 'mt-s6' : (ornament === 'tile' ? 'mt-s3' : 'mt-s6')}`}>
            {actions}
          </div>
        )}

      </div>
    </div>
  );
}
