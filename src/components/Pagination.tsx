import './Pagination.css';

export interface PaginationProps {
  /** 1-based current page. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current page. Default 1. */
  siblingCount?: number;
  label?: string;
  className?: string;
}

function pageWindow(page: number, totalPages: number, siblingCount: number): (number | 'gap')[] {
  const pages = new Set<number>([1, totalPages]);
  for (let p = page - siblingCount; p <= page + siblingCount; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push('gap');
    out.push(p);
    prev = p;
  }
  return out;
}

/** Page navigation for long retrieval lists and audit logs. */
export function Pagination({ page, totalPages, onPageChange, siblingCount = 1, label = 'Pages', className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;
  const clamped = Math.min(totalPages, Math.max(1, page));
  const items = pageWindow(clamped, totalPages, siblingCount);

  const go = (next: number) => {
    if (next >= 1 && next <= totalPages && next !== clamped) onPageChange(next);
  };

  return (
    <nav className={className} data-pagination="" aria-label={label}>
      <button type="button" data-pagebtn="" disabled={clamped === 1} aria-label="Previous page" onClick={() => go(clamped - 1)}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7.5 3L4.5 6l3 3" />
        </svg>
      </button>
      {items.map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} data-pagegap="" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            data-pagebtn=""
            data-current={item === clamped ? '' : undefined}
            aria-label={`Page ${item}`}
            aria-current={item === clamped ? 'page' : undefined}
            onClick={() => go(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        data-pagebtn=""
        disabled={clamped === totalPages}
        aria-label="Next page"
        onClick={() => go(clamped + 1)}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.5 3l3 3-3 3" />
        </svg>
      </button>
    </nav>
  );
}
