import './DiffStatPill.css';
import { useDiffStat, type DiffStatPillProps } from './agentOps.shared';

export function DiffStatPill(props: DiffStatPillProps) {
  const { added, removed, fileName, className = '' } = props;
  const d = useDiffStat(props);
  return (
    <div className={'diff-stat ' + className} data-diff-stat-pill="" data-added={added} data-removed={removed} title={d.title}>
      {fileName && <span className="diff-stat-file" data-diff-stat-filename=""><span>{d.dir}</span>{d.base}</span>}
      <span className="diff-stat-num" data-diff-stat-numbers="">
        <span data-diff-stat-num="added">{'+' + added}</span>
        <span data-diff-stat-num="removed">{'−' + removed}</span>
      </span>
      <span className="diff-stat-bar" data-diff-stat-bar-container="" aria-hidden="true">
        {added > 0 && <i data-diff-stat-bar="added" style={{ width: d.aW + '%' }} />}
        {removed > 0 && <i data-diff-stat-bar="removed" style={{ width: d.rW + '%' }} />}
      </span>
    </div>
  );
}

export type { DiffStatPillProps } from './agentOps.shared';
