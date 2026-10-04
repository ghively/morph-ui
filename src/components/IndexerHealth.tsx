import './mediaLibrary.shared.css';
import './IndexerHealth.css';
import { useState } from 'react';

export type Health = 'ok' | 'warn' | 'error' | 'disabled';

export interface Service {
  id: string;
  name: string;
  kind: 'indexer' | 'client' | 'app';
  protocol?: 'usenet' | 'torrent';
  status: Health;
  latency?: number[];
  grabs?: number;
  queries?: number;
  message?: string;
  app?: string;
}

export interface IndexerHealthProps {
  services: Service[];
  onTest?: (s: Service) => void | Promise<boolean>;
  onOpen?: (s: Service) => void;
  className?: string;
}

const K: Record<Health, { l: string; k: string }> = {
  ok: { l: 'Healthy', k: 'var(--state-ok)' },
  warn: { l: 'Degraded', k: 'var(--state-warn)' },
  error: { l: 'Failing', k: 'var(--state-error)' },
  disabled: { l: 'Disabled', k: 'var(--state-idle)' },
};

const GROUPS: { kind: Service['kind']; l: string }[] = [
  { kind: 'indexer', l: 'Indexers' },
  { kind: 'client', l: 'Download clients' },
  { kind: 'app', l: 'Apps' },
];

function Spark({ v, k }: { v: number[]; k: string }) {
  const max = Math.max(1, ...v);
  return (
    <span className="ihA-spark" aria-hidden="true" style={{ ['--k' as string]: k }}>
      {v.map((x, i) => (
        <i
          key={i}
          data-zero={x === 0 ? '' : undefined}
          style={{ height: Math.max(8, (x / max) * 100) + '%' }}
        />
      ))}
    </span>
  );
}

export function IndexerHealth(p: IndexerHealthProps) {
  const [testing, setTesting] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, boolean>>({});
  const bad = p.services.filter(s => s.status === 'error').length;
  const warn = p.services.filter(s => s.status === 'warn').length;
  const overall: Health = bad ? 'error' : warn ? 'warn' : 'ok';

  const test = async (s: Service) => {
    if (!p.onTest) return;
    setTesting(s.id);
    const r = await p.onTest(s);
    setTesting(null);
    if (typeof r === 'boolean') setResult(x => ({ ...x, [s.id]: r }));
  };

  return (
    <section className={'ml ihA ml-glass ' + (p.className || '')} aria-label="Service health">
      <header className="ihA-head" style={{ ['--k' as string]: K[overall].k }}>
        <span className="ihA-orb" aria-hidden="true" />
        <div className="ihA-ht">
          <h3 className="ml-h">
            {overall === 'ok'
              ? 'All systems healthy'
              : bad
              ? bad + ' failing' + (warn ? ', ' + warn + ' degraded' : '')
              : warn + ' degraded'}
          </h3>
          <span className="ml-sm ml-faint">{p.services.length} services checked</span>
        </div>
      </header>
      {GROUPS.map(g => {
        const list = p.services.filter(s => s.kind === g.kind);
        if (!list.length) return null;
        return (
          <div key={g.kind} className="ihA-group">
            <div className="ihA-gl">{g.l}</div>
            <ul className="ml-list">
              {list.map(s => {
                const st = K[s.status];
                const validLat = s.latency?.filter(Boolean) ?? [];
                const avg = validLat.length
                  ? Math.round(validLat.reduce((a, b) => a + b, 0) / validLat.length)
                  : null;
                return (
                  <li key={s.id} className="ml-li ihA-row" data-health={s.status} style={{ ['--k' as string]: st.k }}>
                    <span className="ihA-dot" aria-hidden="true" />
                    <div className="ihA-main">
                      <div className="ml-row">
                        <button type="button" className="ihA-name" onClick={() => p.onOpen?.(s)}>
                          {s.name}
                        </button>
                        {s.protocol && <span className="ml-chip">{s.protocol}</span>}
                        <span className="ml-chip" style={{ ['--k' as string]: st.k }}>
                          {st.l}
                        </span>
                        {result[s.id] != null && (
                          <span
                            className="ml-chip"
                            style={{ ['--k' as string]: result[s.id] ? 'var(--state-ok)' : 'var(--state-error)' }}
                          >
                            {result[s.id] ? 'Test passed' : 'Test failed'}
                          </span>
                        )}
                      </div>
                      {s.message && (
                        <span className="ihA-msg" data-st={s.status}>
                          {s.message}
                        </span>
                      )}
                    </div>
                    {s.latency && (
                      <div className="ihA-lat">
                        <Spark v={s.latency} k={st.k} />
                        <span className="ml-num">{avg != null ? avg + ' ms' : '—'}</span>
                      </div>
                    )}
                    {s.queries != null && (
                      <div className="ihA-cnt ml-num">
                        <b>{s.grabs}</b>
                        <span>grabs / {s.queries} queries</span>
                      </div>
                    )}
                    {p.onTest && (
                      <button
                        type="button"
                        className="ml-pill"
                        data-size="sm"
                        disabled={testing === s.id}
                        onClick={() => test(s)}
                      >
                        {testing === s.id ? 'Testing…' : 'Test'}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
