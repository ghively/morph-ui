import './LibraryGrid.css';
import { useMediaTheme, useLibrary, LETTERS, SORTS, FILTERS, type LibraryGridProps, type LibSort } from './mediaLibrary.shared';
import { PosterCard } from './PosterCard';

export type { LibraryGridProps } from './mediaLibrary.shared';

export function LibraryGrid(p: LibraryGridProps) {
  const g = useLibrary(p);
  const th = useMediaTheme();
  const shape = th.shape ?? 'portrait';
  return (
    <section className={'ml lgA ' + (p.className || '')} aria-label={p.title ?? 'Library'} style={th.accent ? { ['--morph-accent' as string]: th.accent } : undefined}>
      <header className="lgA-bar">
        <div className="lgA-t">
          <h3>{p.title ?? th.label ?? 'Library'}</h3>
          <span className="ml-num">{g.count === g.total ? g.total : g.count + ' of ' + g.total}</span>
        </div>
        <div className="lgA-ctl">
          <div className="lgA-seg" role="group" aria-label="Filter">
            {FILTERS.map(f => (
              <button key={f.v} type="button" aria-pressed={g.filter === f.v} onClick={() => g.setFilter(f.v)}>
                {f.l}
              </button>
            ))}
          </div>
          <label className="lgA-sort">
            <span>Sort</span>
            <select value={g.sort} onChange={e => g.setSort(e.target.value as LibSort)}>
              {SORTS.map(s => (
                <option key={s.v} value={s.v}>
                  {s.l}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <div className="lgA-body">
        <div className="lgA-scroll" ref={g.sc} onScroll={g.onScroll} style={{ maxHeight: p.height ?? 520 }} onKeyDown={g.onKeyDown}>
          {g.rows.length === 0 ? (
            <div className="lgA-empty">No items match this filter.</div>
          ) : (
            <div className="lgA-grid" data-shape={shape}>
              {g.rows.map(it => (
                <div key={it.id} data-letter={g.letterOf(it)}>
                  <PosterCard item={it} shape={shape} onOpen={p.onOpen} onPlay={p.onPlay} />
                </div>
              ))}
            </div>
          )}
        </div>
        {g.alpha && g.rows.length > 0 && (
          <nav className="lgA-alpha" aria-label="Jump to letter">
            {LETTERS.map(L => (
              <button key={L} type="button" disabled={!g.available.has(L)} aria-current={g.active === L || undefined} onClick={() => g.jump(L)}>
                {L}
              </button>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
