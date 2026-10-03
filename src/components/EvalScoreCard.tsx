import './EvalScoreCard.css';
import { useEval, cv, TONE_LABEL, type EvalScoreCardProps } from './agentOps.shared';

export function EvalScoreCard(props: EvalScoreCardProps) {
  const { title, subtitle, className = '' } = props;
  const e = useEval(props);
  return (
    <div className={'eval-card ' + className} data-eval="" data-tone={e.tone} style={cv(e.color)}>
      <div className="eval-card-head" data-evalhead="">
        <div className="eval-card-tt"><h3 data-evaltitle="">{title}</h3>{subtitle && <p data-evalsub="">{subtitle}</p>}</div>
        <div className="eval-card-ov" data-evaloverall="" aria-label={'Overall score ' + e.total + ' of 100'}><b>{e.total}</b><span>{TONE_LABEL[e.tone]}</span></div>
      </div>
      <table className="eval-card-t">
        <thead><tr><th>Dimension</th><th>Score</th><th>Target</th><th>Δ</th></tr></thead>
        <tbody data-evallist="">
          {e.rows.map(d => (
            <tr key={d.name} data-evalrow="" data-met={d.met ? '' : undefined}>
              <td data-evalname="">{d.name}<span className="eval-card-mini" data-evalbar="" role="img" aria-label={d.name + ': ' + d.score + ' of 100'}><span data-evalfill="" style={{ width: d.s + '%' }} />{d.t !== undefined && <i data-evaltarget="" style={{ left: d.t + '%' }} />}</span></td>
              <td data-evalscore="">{d.score}</td>
              <td>{d.target ?? '—'}</td>
              <td>{d.delta === undefined ? '' : <span className="eval-card-d">{(d.delta >= 0 ? '+' : '−') + Math.abs(d.delta)}</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type { EvalDimension, EvalScoreCardProps } from './agentOps.shared';
