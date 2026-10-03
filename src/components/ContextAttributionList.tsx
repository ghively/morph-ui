import './ContextAttributionList.css';
import { useAttribution, fmtK, cv, type ContextAttributionListProps } from './ragAnswer.shared';

export function ContextAttributionList(props: ContextAttributionListProps) {
  const a = useAttribution(props);
  return (
    <div className={'attribution ' + (props.className || '')} data-attribution="" data-level={a.level} style={cv(a.levelColor)}>
      <table className="attribution-t">
        <caption className="attribution-cap">{a.title}</caption>
        <thead>
          <tr><th scope="col">Source</th><th scope="col" className="attribution-dc">Dept</th><th scope="col"><span className="attribution-sr">Relative size</span></th><th scope="col" className="attribution-num">Tok</th><th scope="col" className="attribution-num">Share</th></tr>
        </thead>
        <tbody>
          {a.empty && <tr><td colSpan={5} className="attribution-empty"><span>&gt;</span> no context consumed.</td></tr>}
          {a.rows.map(r => (
            <tr key={r.source}>
              <td className="attribution-src">{r.source}</td>
              <td className="attribution-dc attribution-dept">{r.department || '—'}</td>
              <td className="attribution-barc" aria-hidden="true"><span className="attribution-bar"><i style={{ width: r.w + '%' }} /></span></td>
              <td className="attribution-num">{fmtK(r.tokens)}</td>
              <td className="attribution-num attribution-share">{r.sharePct}%</td>
            </tr>
          ))}
        </tbody>
        {!a.empty && (
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td className="attribution-dc" />
              <td className="attribution-barc">{a.budget ? <span className="attribution-budget" role="progressbar" aria-valuemin={0} aria-valuemax={a.budget} aria-valuenow={Math.min(a.budget, a.total)} aria-label="Context window usage"><i style={{ width: Math.min(100, a.usedPct || 0) + '%' }} /></span> : null}</td>
              <td className="attribution-num">{fmtK(a.total)}</td>
              <td className="attribution-num attribution-used">{a.usedPct != null ? a.usedPct + '%' : ''}</td>
            </tr>
          </tfoot>
        )}
      </table>
      {a.level !== 'ok' && a.budget && <div className="attribution-log">{'> ' + (a.level === 'danger' ? 'CRIT' : 'WARN') + ': ' + a.usedPct + '% of ' + fmtK(a.budget) + ' window · ' + fmtK(a.free || 0) + ' free'}</div>}
    </div>
  );
}

export type { AttributionEntry, ContextAttributionListProps } from './ragAnswer.shared';
