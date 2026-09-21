import './RetrievalInspector.css';

export interface RetrievedChunk {
  id: string;
  title: string;
  excerpt: string;
  /** 0–1 relevance score. */
  score: number;
  department?: string;
  tokens?: number;
}

export interface RetrievalInspectorProps {
  chunks: RetrievedChunk[];
  /** Scores below this render dimmed with a "below threshold" flag. */
  threshold?: number;
  formatScore?: (score: number) => string;
  className?: string;
}

/** Expandable ranked-chunk list with score bars; the "show your work" panel for RAG answers. */
export function RetrievalInspector({ chunks, threshold = 0.7, formatScore = (s) => s.toFixed(2), className = '' }: RetrievalInspectorProps) {
  const ranked = [...chunks].sort((a, b) => b.score - a.score);
  return (
    <div className={className} data-retrieval="">
      <div data-retrievalhead="">
        <span data-retrievaltitle="">Retrieved chunks</span>
        <span data-retrievalcount="">{ranked.length}</span>
      </div>
      {ranked.length === 0 && <div data-retrievalempty="">Nothing retrieved for this query.</div>}
      <ol data-retrievallist="">
        {ranked.map((c, i) => {
          const below = c.score < threshold;
          return (
            <li key={c.id} data-chunk="" data-below={below ? '' : undefined}>
              <details>
                <summary data-chunksummary="">
                  <span data-chunkrank="" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span data-chunktitle="">{c.title}</span>
                  <span data-chunkscore="" role="img" aria-label={`Score ${formatScore(c.score)}${below ? ', below threshold' : ''}`}>
                    <span data-scorebar="">
                      <span data-scorebarfill="" style={{ width: `${Math.round(c.score * 100)}%` }} />
                    </span>
                    {formatScore(c.score)}
                  </span>
                </summary>
                <div data-chunkbody="">
                  <p data-chunkexcerpt="">{c.excerpt}</p>
                  <div data-chunkmeta="">
                    {c.department && <span>{c.department}</span>}
                    {c.tokens !== undefined && <span>{c.tokens.toLocaleString()} tokens</span>}
                    {below && <span data-belowflag="">below {formatScore(threshold)} threshold</span>}
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
