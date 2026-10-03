import './PosterCard.css';
import { Art, usePosterCard, type PosterCardProps } from './mediaLibrary.shared';

export type { PosterCardProps } from './mediaLibrary.shared';

export function PosterCard(props: PosterCardProps) {
  const c = usePosterCard(props);
  if (!c.it) return null;
  const t = c.it.title;
  return (
    <div className={'ml pcA ' + (props.className || '')} data-shape={c.shape} data-selected={props.selected ? '' : undefined} data-played={c.played ? '' : undefined} style={c.style}>
      <div className="pcA-frame">
        <button
          type="button"
          className="pcA-open"
          data-card-open=""
          onClick={c.open}
          aria-label={t + (c.sub ? ', ' + c.sub : '') + (c.played ? ', watched' : c.progress ? ', ' + Math.round(c.progress * 100) + '% watched' : '')}
        >
          <Art item={c.it} type={c.art.type} fallback={c.art.fallback} shape={c.shape} alt="" className="pcA-art" latency={props.latency} />
        </button>
        {props.onPlay && (
          <button type="button" className="pcA-play" onClick={c.play} aria-label={(c.progress ? 'Resume ' : 'Play ') + t}>
            <span aria-hidden="true">▶</span>
          </button>
        )}
        <div className="pcA-corner">
          {c.unplayed > 0 && <span className="pcA-count" aria-label={c.unplayed + ' unplayed'}>{c.unplayed}</span>}
          <button type="button" className="pcA-tick" data-on={c.played ? '' : undefined} aria-pressed={c.played} aria-label={c.played ? 'Mark unplayed' : 'Mark played'} onClick={c.togglePlayed}>
            ✓
          </button>
        </div>
        <button type="button" className="pcA-fav" data-on={c.fav ? '' : undefined} aria-pressed={c.fav} aria-label={c.fav ? 'Remove favorite' : 'Add favorite'} onClick={c.toggleFav}>
          ★
        </button>
        {c.progress > 0 && (
          <span className="pcA-prog" role="img" aria-label={Math.round(c.progress * 100) + '% watched'}>
            <i style={{ width: c.progress * 100 + '%' }} />
          </span>
        )}
      </div>
      {props.showTitle !== false && (
        <div className="pcA-cap">
          <span className="pcA-title" title={t}>{t}</span>
          <span className="pcA-sub">{c.left ? c.left + 'm left' : c.sub}</span>
        </div>
      )}
    </div>
  );
}
