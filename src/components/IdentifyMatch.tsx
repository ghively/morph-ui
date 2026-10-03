import './IdentifyMatch.css';
import { useState, type CSSProperties } from 'react';
import { Art, useAccent, type MediaItem } from './mediaLibrary.shared';

export interface MatchResult {
  id: string;
  item: MediaItem;
  provider: string;
  providerIds?: Record<string, string>;
  score?: number;
}

export interface IdentifyQuery {
  name: string;
  year?: string;
  providerId?: string;
}

export interface IdentifyMatchProps {
  /** The item being identified (shows path + current match). */
  item: MediaItem;
  path?: string;
  results: MatchResult[];
  searching?: boolean;
  onSearch: (q: IdentifyQuery) => void;
  onApply: (r: MatchResult, opts: { replaceImages: boolean }) => void;
  onCancel?: () => void;
  className?: string;
}

export function IdentifyMatch(p: IdentifyMatchProps) {
  const [q, setQ] = useState<IdentifyQuery>({ name: p.item.title, year: p.item.year ? String(p.item.year) : '' });
  const [sel, setSel] = useState<string | null>(p.results[0]?.id ?? null);
  const [replace, setReplace] = useState(true);
  const pick = p.results.find(r => r.id === sel) ?? null;
  const acc = useAccent(pick?.item ?? p.item);
  const go = () => p.onSearch(q);

  return (
    <section className={'ml imA ml-glass ' + (p.className || '')} style={acc.style} aria-label="Identify">
      <header className="imA-head">
        <h3 className="ml-h">Identify</h3>
        {p.path && (
          <span className="imA-path ml-ell" title={p.path}>
            {p.path}
          </span>
        )}
      </header>
      <form
        className="imA-form"
        onSubmit={e => {
          e.preventDefault();
          go();
        }}
      >
        <label className="imA-f imA-name">
          <span>Name</span>
          <input className="ml-input" value={q.name} onChange={e => setQ({ ...q, name: e.target.value })} />
        </label>
        <label className="imA-f imA-year">
          <span>Year</span>
          <input
            className="ml-input ml-num"
            inputMode="numeric"
            value={q.year ?? ''}
            onChange={e => setQ({ ...q, year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
          />
        </label>
        <label className="imA-f imA-id">
          <span>TMDB / IMDb id</span>
          <input
            className="ml-input"
            placeholder="tt2285752"
            value={q.providerId ?? ''}
            onChange={e => setQ({ ...q, providerId: e.target.value })}
          />
        </label>
        <button type="submit" className="ml-pill imA-go" data-tone="accent">
          {p.searching ? 'Searching…' : 'Search'}
        </button>
      </form>
      <ul className="ml-list imA-list" role="listbox" aria-label="Results" aria-busy={p.searching || undefined}>
        {p.searching &&
          [0, 1].map(i => (
            <li key={i} className="imA-skel" aria-hidden="true">
              <i />
              <span>
                <b />
                <b />
              </span>
            </li>
          ))}
        {!p.searching && p.results.length === 0 && (
          <li className="imA-empty">No matches. Try the original title or a provider id.</li>
        )}
        {!p.searching &&
          p.results.map(r => {
            const on = r.id === sel,
              sc = r.score ?? 0;
            return (
              <li
                key={r.id}
                role="option"
                aria-selected={on}
                className="ml-li imA-row"
                data-active={on ? '' : undefined}
                onClick={() => setSel(r.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSel(r.id);
                  }
                }}
                tabIndex={0}
              >
                <Art item={r.item} type="Primary" shape="portrait" alt="" className="imA-art" />
                <div className="imA-main">
                  <div className="ml-row">
                    <span className="imA-t ml-ell">{r.item.title}</span>
                    <span className="ml-dim ml-num">{r.item.year}</span>
                  </div>
                  <div className="imA-tags">
                    <span className="ml-chip">{r.provider}</span>
                    {Object.entries(r.providerIds ?? {}).map(([k, v]) => (
                      <span key={k} className="imA-pid ml-num">
                        {k}:{v}
                      </span>
                    ))}
                  </div>
                  {r.item.overview && <p className="imA-ov">{r.item.overview}</p>}
                </div>
                {r.score != null && (
                  <span
                    className="imA-score ml-num"
                    style={
                      {
                        ['--k' as string]:
                          sc >= 0.85 ? 'var(--state-ok)' : sc >= 0.6 ? 'var(--state-warn)' : 'var(--state-error)',
                      } as CSSProperties
                    }
                    title="Match confidence"
                  >
                    {Math.round(sc * 100)}%
                  </span>
                )}
              </li>
            );
          })}
      </ul>
      <footer className="imA-foot">
        <label className="imA-chk">
          <input type="checkbox" checked={replace} onChange={e => setReplace(e.target.checked)} />
          <span aria-hidden="true" />
          Replace existing images
        </label>
        <span className="ml-sp" />
        {p.onCancel && (
          <button type="button" className="ml-pill" onClick={p.onCancel}>
            Cancel
          </button>
        )}
        <button
          type="button"
          className="ml-pill"
          data-tone="accent"
          disabled={!pick}
          onClick={() => pick && p.onApply(pick, { replaceImages: replace })}
        >
          Apply match
        </button>
      </footer>
    </section>
  );
}
