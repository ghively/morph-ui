import type { ReactNode, ReactElement } from 'react';
import './NavigationRail.css';

export interface RailNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface RailFooterItem {
  id: string;
  label: string;
  icon: ReactNode;
  title?: string;
  shedWhenFolded?: boolean;
  onSelect: () => void;
}

export interface NavigationRailProps {
  items: RailNavItem[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  primaryAction?: { label: string; icon?: ReactNode; onSelect: () => void };
  footerItems?: RailFooterItem[];
  account?: {
    name: string;
    secondary?: string;
    avatar: ReactNode;
    onSelect: () => void;
    label?: string;
  };
  brand?: { name: string; ornament?: ReactNode; badge?: ReactNode };
  pinned?: boolean;
  onPinnedChange?: (next: boolean) => void;
  label?: string;
  className?: string;
}

export interface BrandWordmarkProps { name: string; className?: string; }
export function BrandWordmark({ name, className = '' }: BrandWordmarkProps): ReactElement {
  const [first, ...rest] = name.split(/(?=[A-Z][a-z])/);
  return (
    <div data-fade="" data-wordmark="" className={className}>
      {first}
      {rest.length > 0 ? <span>{rest.join("")}</span> : null}
    </div>
  );
}

export function NavigationRail({
  items,
  activeId,
  onSelect,
  primaryAction,
  footerItems,
  account,
  brand,
  pinned,
  onPinnedChange,
  label = 'Sections',
  className = ''
}: NavigationRailProps): ReactElement {
  const activeIndex = items.findIndex(i => i.id === activeId);

  return (
    <div data-dockzone="" role="navigation" aria-label={label} className={className}>
      <div style={{ display: "flex", alignItems: "center", height: 56, flex: "none", padding: "0 var(--dock-pad)", gap: 0 }}>
        <span data-markwell="">
          {brand?.ornament ?? <span data-mark="" style={{ width: 24, height: 24, color: "var(--app-rail-text)" }} />}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {brand?.name ? <BrandWordmark name={brand.name} /> : null}
          {brand?.badge}
        </div>
        <button
          data-fade=""
          data-iconbtn=""
          onClick={() => onPinnedChange?.(!pinned)}
          title={pinned ? "Unpin the rail" : "Pin the rail open"}
          aria-label={pinned ? "Unpin the rail" : "Pin the rail open"}
          aria-pressed={pinned}
          style={{ marginLeft: "auto", width: 30, height: 30, borderRadius: "var(--r-ctl)", color: "var(--app-rail-faint)" }}
        >
          {/* Default SVG for pin, user can override via CSS or future props if needed, but for fidelity we need *a* pin glyph if possible or let CSS content handle it. We'll use a simple fallback or empty since we can't import icons from app. Let's use an svg. */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{pointerEvents: 'none'}}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
      </div>

      {primaryAction && (
        <div style={{ padding: "0 var(--dock-pad) 12px" }}>
          <button data-dockitem="" data-primary="" data-state="" onClick={primaryAction.onSelect}>
            {primaryAction.icon}
            <span data-lb="">{primaryAction.label}</span>
          </button>
        </div>
      )}

      <div 
        data-navgroup="" 
        data-nav={activeIndex < 0 ? "none" : String(activeIndex)} 
        style={{ "--nav-i": activeIndex < 0 ? 0 : activeIndex, position: "relative", margin: "0 var(--dock-pad)", padding: "var(--s1) 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s1)" } as React.CSSProperties}
      >
        <div data-ind="" />
        {items.map((n) => {
          const active = n.id === activeId;
          return (
            <button
              key={n.id}
              data-dockitem=""
              data-state=""
              data-on={String(active)}
              aria-current={active ? "page" : undefined}
              title={n.label}
              aria-label={n.label}
              onClick={() => onSelect(n.id)}
            >
              {n.icon}
              <span data-lb="">{n.label}</span>
            </button>
          );
        })}
      </div>

      <div data-fold="shed" style={{ flex: "1 1 auto", minHeight: 0 }} aria-hidden="true" />

      {((footerItems && footerItems.length > 0) || account) && (
        <div style={{ flex: "none", padding: "12px var(--dock-pad) 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s4)" }}>
          {footerItems?.map((f) => (
            <button
              key={f.id}
              data-dockitem=""
              data-state=""
              data-fold={f.shedWhenFolded ? "shed" : undefined}
              onClick={f.onSelect}
              title={f.title ?? f.label}
              aria-label={f.title ?? f.label}
            >
              {f.icon}
              <span data-lb="">{f.label}</span>
            </button>
          ))}
          {account && (
            <button data-dockitem="" data-state="" onClick={account.onSelect} aria-label={account.label ?? 'Settings'}>
              <span data-ic="" style={{ display: "contents" }}>
                {account.avatar}
              </span>
              <span data-lb="" style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                {account.name}
                <span style={{ fontSize: "var(--t-num)", fontWeight: 400, color: "var(--app-rail-faint)" }}>{account.secondary}</span>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
