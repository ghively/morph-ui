import './MediaShelf.css';
import { useShelfScroll, rove, shelfWidth, type MediaShelfProps } from './mediaLibrary.shared';
import { PosterCard } from './PosterCard';

export type { MediaShelfProps } from './mediaLibrary.shared';

export function MediaShelf(p: MediaShelfProps) {
  const s = useShelfScroll(p.items.length);
  const w = shelfWidth(p.shape, p.cardWidth);
  return (
    <section className={'ml msA ' + (p.className || '')} aria-label={p.title}>
      <header className="msA-head">
        <h3 className="msA-title">{p.title}</h3>
        <span className="msA-count ml-num">{p.items.length}</span>
        <span className="msA-sp" />
        {p.onSeeAll && (
          <button type="button" className="msA-all" onClick={p.onSeeAll}>
            See all
          </button>
        )}
        <button type="button" className="msA-nav" aria-label="Previous" disabled={!s.prev} onClick={() => s.page(-1)}>
          ‹
        </button>
        <button type="button" className="msA-nav" aria-label="Next" disabled={!s.next} onClick={() => s.page(1)}>
          ›
        </button>
      </header>
      {p.items.length === 0 ? (
        <div className="msA-empty">{p.emptyText ?? 'Nothing here yet.'}</div>
      ) : (
        <div
          className="msA-track"
          ref={s.ref}
          onScroll={s.onScroll}
          onKeyDown={rove('[data-card-open]', () => s.ref.current)}
          data-edge-l={s.prev ? '' : undefined}
          data-edge-r={s.next ? '' : undefined}
        >
          {p.items.map(it => (
            <PosterCard key={it.id} item={it} shape={p.shape} width={w} onOpen={p.onOpen} onPlay={p.onPlay} className="msA-card" />
          ))}
        </div>
      )}
    </section>
  );
}
