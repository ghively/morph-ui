import './CollectionTile.css';
import { Art, useAccent, type MediaItem } from './mediaLibrary.shared';

export interface CollectionTileProps {
  collection: MediaItem;
  /** Members; the first three are fanned when the collection has no Primary of its own. */
  items: MediaItem[];
  /** Prefer the collection's own Primary art over the fan (default false). */
  preferOwnArt?: boolean;
  width?: number | string;
  onOpen?: (c: MediaItem) => void;
  className?: string;
}

export function CollectionTile(p: CollectionTileProps) {
  const lead = p.items.find(i => i.art.Primary) ?? p.items[0] ?? null;
  const acc = useAccent(p.preferOwnArt && p.collection.art.Primary ? p.collection : lead);
  const fan = p.items.slice(0, 3);
  const watched = p.items.filter(i => i.played).length;
  const years = p.items.map(i => i.year).filter(Boolean) as number[];
  const span = years.length ? Math.min(...years) + (Math.max(...years) !== Math.min(...years) ? '–' + Math.max(...years) : '') : '';
  const own = p.preferOwnArt && p.collection.art.Primary;

  return (
    <div className={'ml ctA ' + (p.className || '')} style={{ ...acc.style, ...(p.width != null ? { width: p.width } : {}) }}>
      <button
        type="button"
        className="ctA-btn"
        onClick={() => p.onOpen?.(p.collection)}
        aria-label={p.collection.title + ', ' + p.items.length + ' items' + (watched ? ', ' + watched + ' watched' : '')}
      >
        <div className="ctA-stage">
          {own ? (
            <Art item={p.collection} type="Primary" shape="fill" alt="" />
          ) : (
            <>
              <Art item={lead} type="Backdrop" fallback={['Thumb']} shape="fill" alt="" className="ctA-bg" empty={null} />
              <div className="ctA-fan" data-n={fan.length}>
                {fan.map((it, i) => (
                  <Art
                    key={it.id}
                    item={it}
                    type="Primary"
                    shape="portrait"
                    alt=""
                    className="ctA-card"
                    style={{ ['--i' as string]: i - (fan.length - 1) / 2, ['--a' as string]: Math.abs(i - (fan.length - 1) / 2) }}
                  />
                ))}
              </div>
            </>
          )}
          <span className="ctA-count ml-num">{p.items.length}</span>
        </div>
        <div className="ctA-cap">
          <span className="ctA-title ml-ell">{p.collection.title}</span>
          <span className="ctA-sub ml-num">{[p.items.length + ' items', span].filter(Boolean).join(' · ')}</span>
          <span className="ml-bar ctA-bar" role="img" aria-label={watched + ' of ' + p.items.length + ' watched'}>
            <i style={{ width: (watched / Math.max(1, p.items.length)) * 100 + '%' }} />
          </span>
        </div>
      </button>
    </div>
  );
}
