import './Pagination.css';
import { pageWindow } from "./layout.shared";
import type { PaginationProps } from './layout.shared';

export function Pagination({ page, totalPages: rawTotal, onPageChange, siblingCount = 1, label = 'Pages', className = '', showSinglePage = false }: PaginationProps) {
  if (rawTotal <= 1 && !showSinglePage) return null;
  const totalPages = Math.max(1, rawTotal);
  const clamped = Math.min(totalPages, Math.max(1, page));
  const items = pageWindow(clamped, totalPages, siblingCount);
  const go = (next: number) => { if (next >= 1 && next <= totalPages && next !== clamped) onPageChange(next); };
  return (
    <nav className={className} data-pagination="" aria-label={label}>
      <button type="button" data-pagebtn="" disabled={clamped === 1} aria-label="Previous page" onClick={() => go(clamped - 1)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.5 3L4.5 6l3 3" /></svg></button>
      {items.map((item, i) => item === 'gap' ? <span key={`gap-${i}`} data-pagegap="" aria-hidden="true">…</span> : <button key={item} type="button" data-pagebtn="" data-current={item === clamped ? '' : undefined} aria-label={`Page ${item}`} aria-current={item === clamped ? 'page' : undefined} onClick={() => go(item as number)}>{item}</button>)}
      <button type="button" data-pagebtn="" disabled={clamped === totalPages} aria-label="Next page" onClick={() => go(clamped + 1)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.5 3l3 3-3 3" /></svg></button>
    </nav>
  );
}
export type { PaginationProps } from './layout.shared';
