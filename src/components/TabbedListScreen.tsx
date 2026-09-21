import type { ReactElement, ReactNode } from 'react';
import './TabbedListScreen.css';

export interface ScreenTab {
  id: string;
  label: string;
  /** Rendered as `[data-count]` inside the tab. */
  count?: number;
}

export interface TabbedListScreenProps {
  tabs: ScreenTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  /** Accessible name for the tablist. */
  tablistLabel: string;
  /** Accent slot: 'blue' | 'cyan' | 'green' | 'gold' — the neutral 4-slot vocabulary. */
  accent?: string;
  /** Search cap in the tool rail. Omit for none. */
  search?: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    ariaLabel: string;
  };
  /** Right-aligned tool-rail slot (status chips, New buttons). */
  toolbarEnd?: ReactNode;
  /** Max width of the content column. Default 1180. */
  contentMaxWidth?: number;
  /** When true the content area is `role="tabpanel"`. Default true. */
  tabpanel?: boolean;
  children: ReactNode;
  className?: string;
}

function GlyphIcon({ name, size = 14 }: { name: string; size?: number }) {
  if (name === 'search') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="7" cy="7" r="5" />
        <line x1="10.5" y1="10.5" x2="15" y2="15" />
      </svg>
    );
  }
  return null;
}

export function TabbedListScreen({
  tabs,
  activeTab,
  onTabChange,
  tablistLabel,
  accent,
  search,
  toolbarEnd,
  contentMaxWidth = 1180,
  tabpanel = true,
  children,
  className = ''
}: TabbedListScreenProps): ReactElement {
  const hasRail = tabs.length > 0;

  return (
    <div
      data-screen=""
      data-sec={accent}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: hasRail ? "hidden" : "auto",
        height: "100%"
      }}
    >
      {hasRail && (
        <div data-toolrail="">
          <div data-tabstrip="" role="tablist" aria-label={tablistLabel}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                data-tab=""
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span data-count="">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
          
          {search && (
            <div data-focusring="" data-search="" data-searchcap="">
              <GlyphIcon name="search" size={14} />
              <input
                placeholder={search.placeholder}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                aria-label={search.ariaLabel}
                style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--app-text)", fontSize: "var(--t-ctl)" }}
              />
            </div>
          )}

          {toolbarEnd && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "var(--s3)", flex: "none" }}>
              {toolbarEnd}
            </div>
          )}
        </div>
      )}

      <div style={
        hasRail 
          ? { flex: 1, minHeight: 0, overflow: "auto", padding: "18px var(--gut) 26px" }
          : { padding: "18px var(--gut) 26px" }
      }>
        <div 
          style={{ maxWidth: contentMaxWidth, margin: "0 auto" }} 
          role={tabpanel ? "tabpanel" : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
