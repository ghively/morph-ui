import './MediaInfoBadges.css';
import { useMediaItem, mediaBadges, specRows, type ItemSource } from './mediaLibrary.shared';

export interface MediaInfoBadgesProps extends ItemSource {
  /** inline: one row of chips. sheet: chips + a stream spec table. */
  variant?: 'inline' | 'sheet';
  showRatings?: boolean;
  /** Badge groups to hide, e.g. ['official'] when the host already shows the rating. */
  omit?: ('video' | 'range' | 'audio' | 'subs' | 'rating' | 'official')[];
  className?: string;
}

export function MediaInfoBadges(p: MediaInfoBadgesProps) {
  const it = useMediaItem(p);
  const b = mediaBadges(it).filter(x => !p.omit?.includes(x.group));
  const rows = p.variant === 'sheet' ? specRows(it) : [];
  if (!it) return null;
  const ratings = p.showRatings !== false && (it.community != null || it.critic != null);
  return (
    <div className={'ml mbA ' + (p.className || '')} data-variant={p.variant ?? 'inline'}>
      <ul className="mbA-row" aria-label="Media info">
        {ratings && it.community != null && (
          <li className="mbA-rate" title="Community rating">
            <span aria-hidden="true">★</span>
            {it.community.toFixed(1)}
          </li>
        )}
        {ratings && it.critic != null && (
          <li className="mbA-rate" data-critic={it.critic >= 60 ? 'fresh' : 'rotten'} title="Critic score">
            {it.critic}%
          </li>
        )}
        {b.map(x => (
          <li key={x.key} className="mbA-chip" data-group={x.group} data-key={x.key} title={x.title}>
            {x.label}
          </li>
        ))}
      </ul>
      {rows.length > 0 && (
        <dl className="mbA-sheet">
          {rows.map((r, i) => (
            <div key={i} className="mbA-kv">
              <dt>{r.k}</dt>
              <dd>{r.v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
