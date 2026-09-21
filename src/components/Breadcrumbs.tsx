import './Breadcrumbs.css';

export interface Crumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  trail: Crumb[];
  /** Collapse middle items behind an ellipsis when longer than this. Default 4. */
  maxVisible?: number;
  label?: string;
  className?: string;
}

/** Hierarchical location trail with overflow collapsing. Last item is current page. */
export function Breadcrumbs({ trail, maxVisible = 4, label = 'Breadcrumb', className = '' }: BreadcrumbsProps) {
  if (trail.length === 0) return null;
  const collapsed = trail.length > maxVisible;
  const shown = collapsed ? [trail[0]!, '__gap' as const, ...trail.slice(-(maxVisible - 1))] : trail;

  return (
    <nav className={className} data-breadcrumbs="" aria-label={label}>
      <ol>
        {shown.map((item, i) => {
          const last = i === shown.length - 1;
          if (item === '__gap') {
            return (
              <li key="gap" data-crumb="" data-gap="">
                <span aria-hidden="true">…</span>
              </li>
            );
          }
          return (
            <li key={`${item.label}-${i}`} data-crumb="" aria-current={last ? 'page' : undefined}>
              {last || (!item.href && !item.onClick) ? (
                <span data-crumbcurrent="">{item.label}</span>
              ) : item.href ? (
                <a href={item.href} onClick={item.onClick ? (e) => { e.preventDefault(); item.onClick?.(); } : undefined}>
                  {item.label}
                </a>
              ) : (
                <button type="button" onClick={item.onClick}>
                  {item.label}
                </button>
              )}
              {!last && (
                <span data-crumbsep="" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
