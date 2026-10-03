import "./Breadcrumbs.css";
import { useBreadcrumbs } from "./layout.shared";
import type { BreadcrumbsProps } from "./layout.shared";

export function Breadcrumbs({
  trail,
  maxVisible = 4,
  label = "Breadcrumb",
  className = "",
}: BreadcrumbsProps) {
  const { shown } = useBreadcrumbs(trail, maxVisible);
  if (trail.length === 0) return null;
  return (
    <nav className={className} data-breadcrumbs="" aria-label={label}>
      <ol>
        {shown.map((item, i) => {
          const last = i === shown.length - 1;
          if (item === "__gap")
            return (
              <li key="gap" data-crumb="" data-gap="">
                <span aria-hidden="true">…</span>
              </li>
            );
          return (
            <li
              key={`${item.label}-${i}`}
              data-crumb=""
              aria-current={last ? "page" : undefined}
            >
              {last || (!item.href && !item.onClick) ? (
                <span data-crumbcurrent="">{item.label}</span>
              ) : item.href ? (
                <a
                  href={item.href}
                  onClick={
                    item.onClick
                      ? (e) => {
                          e.preventDefault();
                          item.onClick?.();
                        }
                      : undefined
                  }
                >
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
export type { Crumb, BreadcrumbsProps } from "./layout.shared";
