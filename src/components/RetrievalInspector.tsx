import { Fragment } from 'react';
import './RetrievalInspector.css';
import { useRetrieval, fmtK, type RetrievalInspectorProps } from './ragAnswer.shared';

export function RetrievalInspector(props: RetrievalInspectorProps) {
  const r = useRetrieval(props);
  return (
    <div className={'retrieval ' + (props.className || '')} data-retrieval="">
      <div className="retrieval-cap">
        <span className="retrieval-title">{r.title}</span>
        <span className="retrieval-sum">{r.empty ? '0 results' : r.above + ' of ' + r.rows.length + ' kept · ' + fmtK(r.tokens) + ' tok'}</span>
      </div>
      {r.empty ? <div className="retrieval-empty"><span>&gt;</span> nothing retrieved for this query.</div> : (
        <>
          <div className="retrieval-head" aria-hidden="true"><span>#</span><span>Chunk</span><span className="retrieval-dcol">Dept</span><span>Tok</span><span>Score</span></div>
          <ol className="retrieval-list" onKeyDown={r.onKeyDown}>
            {r.rows.map((c, i) => (
              <Fragment key={c.id}>
                {c.below && (i === 0 || !r.rows[i - 1]!.below) && <li className="retrieval-cut" role="presentation"><span>threshold {r.thFmt}</span></li>}
                <li className="retrieval-row" data-chunk="" data-below={c.below ? '' : undefined} data-open={c.open ? '' : undefined}>
                  <button {...c.btn} className="retrieval-sumrow" data-chunkbtn="" onClick={c.toggle}>
                    <span className="retrieval-rank">{c.rank}</span>
                    <span className="retrieval-name" data-chunktitle="">{c.title}</span>
                    <span className="retrieval-dept retrieval-dcol">{c.department || '—'}</span>
                    <span className="retrieval-tok">{c.tokens !== undefined ? fmtK(c.tokens) : '—'}</span>
                    <span className="retrieval-score" aria-label={'Score ' + c.fmt + (c.below ? ', below threshold' : '')}>
                      <span className="retrieval-bar" aria-hidden="true"><i style={{ width: c.pct + '%' }} /></span>{c.fmt}
                    </span>
                  </button>
                  <div id={c.bodyId} className="retrieval-body" aria-hidden={!c.open}>
                    <div className="retrieval-clip">
                      <p className="retrieval-ex"><span aria-hidden="true">&gt;</span> {c.excerpt}</p>
                    </div>
                  </div>
                </li>
              </Fragment>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

export type { RetrievedChunk, RetrievalInspectorProps } from './ragAnswer.shared';
