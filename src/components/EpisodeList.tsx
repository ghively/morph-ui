import './EpisodeList.css';
import { Art, fmtRuntime, pad2, localDate, useEpisodes, type EpisodeListProps } from './mediaLibrary.shared';
import { TextShimmer } from './TextShimmer';

export type { EpisodeListProps, Season } from './mediaLibrary.shared';

export function EpisodeList(p: EpisodeListProps) {
  const e = useEpisodes(p);
  return (
    <section className={'ml elA ' + (p.className || '')} aria-label="Episodes">
      {e.tabs.length > 1 && (
        <div className="elA-tabs" role="tablist" onKeyDown={e.tabKeys}>
          {e.tabs.map(t => (
            <button key={t.id} type="button" role="tab" data-season-tab="" aria-selected={t.active} tabIndex={t.active ? 0 : -1} onClick={() => e.pick(t.id)}>
              {t.name}<span className="ml-num">{t.count}</span>
            </button>
          ))}
        </div>
      )}
      {e.eps.length === 0 ? (
        <div className="elA-empty">No episodes in {e.season?.name ?? 'this season'}.</div>
      ) : (
        <ol className="elA-list" role="list" onKeyDown={e.onKeyDown}>
          {e.eps.map(ep => {
            const next = ep.id === e.nextUp;
            const prog = !ep.played && ep.progress ? ep.progress : 0;
            return (
              <li key={ep.id} className="elA-row" data-next={next ? '' : undefined} data-played={ep.played ? '' : undefined} style={ep.accent ? { ['--c' as string]: ep.accent } : undefined}>
                <button
                  type="button"
                  className="elA-thumb"
                  data-ep-btn=""
                  onClick={() => (p.onPlay ?? p.onOpen)?.(ep)}
                  aria-label={(prog ? 'Resume ' : 'Play ') + 'episode ' + ep.index + ', ' + ep.title}
                >
                  <Art item={ep} type="Primary" fallback={['Thumb', 'Backdrop']} shape="landscape" alt="" className="elA-art" />
                  <span className="elA-play" aria-hidden="true">▶</span>
                  {prog > 0 && (
                    <span className="elA-prog" aria-hidden="true">
                      <i style={{ width: prog * 100 + '%' }} />
                    </span>
                  )}
                </button>
                <div className="elA-main">
                  <div className="elA-top">
                    <span className="elA-n ml-num">{pad2(ep.index)}</span>
                    <button type="button" className="elA-title" onClick={() => p.onOpen?.(ep)}>
                      {ep.title}
                    </button>
                    {next && (
                      <span className="elA-next">
                        <TextShimmer color="var(--c)" shimmerColor="#fff">
                          {prog ? 'Resume' : 'Next up'}
                        </TextShimmer>
                      </span>
                    )}
                    {ep.played && <span className="elA-done" aria-label="Watched">✓</span>}
                  </div>
                  <div className="elA-meta ml-num">
                    {[
                      fmtRuntime(ep.runtimeMin),
                      ep.premiere && localDate(ep.premiere)!.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }),
                      prog ? Math.round(prog * 100) + '% watched' : '',
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  {ep.overview && <p className="elA-ov">{ep.overview}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
