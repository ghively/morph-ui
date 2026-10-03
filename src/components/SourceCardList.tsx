import './SourceCardList.css';
import { useSources, type SourceCardListProps } from './ragAnswer.shared';

export function SourceCardList(props: SourceCardListProps) {
  const s = useSources(props);
  const cls = 'source-cards ' + (props.className || '');
  if (s.empty) return <div className={cls} data-sourcecards="" data-nosources=""><span className="source-cards-p" aria-hidden="true">&gt;</span> {s.emptyText}</div>;
  return (
    <div className={cls} data-sourcecards="" data-compact={props.compact ? '' : undefined}>
      <div className="source-cards-head" aria-hidden="true"><span>#</span><span>Source</span><span>Rel</span></div>
      <ol className="source-cards-list" onKeyDown={s.onKeyDown}>
        {s.rows.map(r => (
          <li key={r.id} className="source-cards-row" data-sourcecard="" data-active={r.active ? '' : undefined}>
            <button type="button" className="source-cards-btn" data-sourcebtn="" onClick={r.select} aria-current={r.active || undefined}>
              <span className="source-cards-n">{String(r.n).padStart(2, '0')}</span>
              <span className="source-cards-main">
                <span className="source-cards-title">{r.title}</span>
                {!props.compact && <span className="source-cards-ex">{r.excerpt}</span>}
                {!props.compact && (r.department || r.host) && (
                  <span className="source-cards-meta">
                    {r.department && <span className="source-cards-dept">[ {r.department.toUpperCase()} ]</span>}
                    {r.host && <span className="source-cards-host">{r.host}</span>}
                  </span>
                )}
              </span>
              <span className="source-cards-score">
                {r.pct !== undefined ? (
                  <span role="img" aria-label={'Relevance ' + r.pct + ' percent'} className="source-cards-rel">
                    <b>{r.pct}</b>
                    <span className="source-cards-ticks" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <i key={i} data-on={i < Math.round((r.score || 0) * 5) ? '' : undefined} />)}</span>
                  </span>
                ) : <span className="source-cards-na">—</span>}
              </span>
            </button>
            {r.url && <a className="source-cards-open" href={r.url} target="_blank" rel="noreferrer" aria-label={'Open ' + r.title}>open ↗</a>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export type { SourceCard, SourceCardListProps } from './ragAnswer.shared';
