import './EvalScoreCard.css';

export interface EvalDimension {
  name: string;
  /** 0–100. */
  score: number;
  target?: number;
}

export interface EvalScoreCardProps {
  title: string;
  subtitle?: string;
  dimensions: EvalDimension[];
  /** Overall 0–100. Defaults to the mean. */
  overall?: number;
  className?: string;
}

/** Answer-quality scorecard: per-dimension bars against targets plus an overall verdict. */
export function EvalScoreCard({ title, subtitle, dimensions, overall, className = '' }: EvalScoreCardProps) {
  const mean = dimensions.length ? dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length : 0;
  const total = overall ?? Math.round(mean);
  const tone = total >= 85 ? 'good' : total >= 65 ? 'ok' : 'bad';
  return (
    <div className={className} data-eval="" data-tone={tone}>
      <div data-evalhead="">
        <div>
          <h3 data-evaltitle="">{title}</h3>
          {subtitle && <p data-evalsub="">{subtitle}</p>}
        </div>
        <div data-evaloverall="" aria-label={`Overall score ${total} of 100`}>
          {total}
        </div>
      </div>
      <ul data-evallist="">
        {dimensions.map((d) => (
          <li key={d.name} data-evalrow="">
            <span data-evalname="">{d.name}</span>
            <span data-evalbar="" role="img" aria-label={`${d.name}: ${d.score} of 100${d.target !== undefined ? `, target ${d.target}` : ''}`}>
              <span data-evalfill="" style={{ width: `${Math.min(100, Math.max(0, d.score))}%` }} />
              {d.target !== undefined && (
                <span data-evaltarget="" style={{ left: `${Math.min(100, Math.max(0, d.target))}%` }} />
              )}
            </span>
            <span data-evalscore="">{d.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
