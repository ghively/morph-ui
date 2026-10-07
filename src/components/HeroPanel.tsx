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
  /** Brand glyph inside the mark tile (ornament='mark'). Defaults to the host's `--mark` mask, which is empty unless set. */
  mark?: ReactNode;
  /** With ornament='tile': pulsing dot. */
  busy?: boolean;
  groups?: HeroChipGroup[];
  /** Buttons rendered at the bottom, unwrapped. */
  actions?: ReactNode;
  /**
   * Body content (a form, a code input, a confirmation) rendered as a full-width,
   * start-aligned column between the description/chips and `actions`.
   * Wrapped in `[data-herobody]`.
   */
  children?: ReactNode;
  /**
   * Size of the `<h1>` title (ornament 'mark' / 'none'): 'hero' = 36px (default),
   * 'h1' = `--t-h1`, 'h2' = `--t-h2`. Hosts can still resize responsively by
   * setting `--hero-title-size` on an ancestor.
   */
  titleSize?: 'hero' | 'h1' | 'h2';
  /** Max width of the inner column. Default 740 ('mark') / 440 (Login) — caller-set. */
  maxWidth?: number;
  className?: string;
}

export function HeroPanel({
  title,
  description,
  ornament = 'mark',
  mark,
  busy,
  groups,
  actions,
  children,
  titleSize = 'hero',
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
              {mark ? <span data-heromark="" aria-hidden="true">{mark}</span> : <span data-mark="" />}
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
            <h1 className="hero-title-mark" data-titlesize={titleSize}>{title}</h1>
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
          <div data-herogroups="">
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

        {/* Body */}
        {children != null && children !== false && (
          <div data-herobody="">{children}</div>
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
