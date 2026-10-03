import './GroundingBadge.css';
import { useGrounding, cv, type GroundingBadgeProps } from './ragAnswer.shared';

export function GroundingBadge(props: GroundingBadgeProps) {
  const g = useGrounding(props);
  return (
    <span className={'grounding ' + (props.className || '')} data-grounding="" data-verdict={props.verdict} role="status" aria-label={g.aria} style={cv(g.color)}>
      <span className="grounding-tag" aria-hidden="true">{g.label.toUpperCase().replace(/ /g, '_')}</span>
      {g.has && <span className="grounding-ticks" aria-hidden="true">{Array.from({ length: g.total }, (_, i) => <i key={i} data-on={i < g.cited ? '' : undefined} />)}</span>}
      {g.detail && <span className="grounding-detail" aria-hidden="true">{g.detail}</span>}
    </span>
  );
}

export type { GroundingVerdict, GroundingBadgeProps } from './ragAnswer.shared';
