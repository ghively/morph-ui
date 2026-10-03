import './CitationPills.css';
import { useCitations, type CitationPillsProps } from './ragAnswer.shared';

export function CitationPills(props: CitationPillsProps) {
  const c = useCitations(props);
  if (c.empty) return null;
  return (
    <span className={'citations ' + (props.className || '')} data-citations="" role="group" aria-label="Citations" onKeyDown={c.onKeyDown}>
      {c.items.map(it => (
        <button key={it.key} {...it.btn} className="citations-ref" title={it.title}>
          <span className="citations-n">{it.n}</span>
        </button>
      ))}
    </span>
  );
}

export type { Citation, CitationPillsProps } from './ragAnswer.shared';
