import './HandoffCard.css';
import { initials, cv, URG_C, URG_LABEL, type HandoffCardProps } from './agentOps.shared';

export function HandoffCard({ to, reason, needed, summary = [], urgency = 'routine', onAccept, from, className = '' }: HandoffCardProps) {
  return (
    <div className={'handoff ' + className} data-handoff="" data-urgency={urgency} style={cv(URG_C[urgency])}>
      <div className="handoff-head" data-handoffhead="">
        <span className="handoff-path">
          {from && <span className="handoff-av is-agent" title={from}>{initials(from)}</span>}
          {from && <span className="handoff-arrow" aria-hidden="true" />}
          <span className="handoff-av" title={to}>{initials(to)}</span>
        </span>
        <span className="handoff-who">
          <span className="handoff-kicker" data-handoffkicker="">{'Handoff · ' + URG_LABEL[urgency]}</span>
          <span className="handoff-to" data-handoffto="">{(from ? from + ' → ' : '→ ') + to}</span>
        </span>
      </div>
      <p className="handoff-reason" data-handoffreason="">{reason}</p>
      {summary.length > 0 && <ul className="handoff-sum" data-handoffsummary="">{summary.map(s => <li key={s}>{s}</li>)}</ul>}
      {needed && <p className="handoff-need" data-handoffneeded=""><b>Needed</b>{needed}</p>}
      {onAccept && <button type="button" className="handoff-btn" data-handoffaccept="" onClick={onAccept}>Take over</button>}
    </div>
  );
}

export type { HandoffCardProps } from './agentOps.shared';
