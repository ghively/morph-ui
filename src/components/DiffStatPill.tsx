import './DiffStatPill.css';

export interface DiffStatPillProps {
  added: number;
  removed: number;
  max?: number;
  fileName?: string;
}

export function DiffStatPill({ added, removed, max, fileName }: DiffStatPillProps) {
  const total = added + removed;
  
  // If max is provided, use it for scaling; otherwise, scale relative to total in this pill
  // The bars are proportional to each other, max just bounds their width
  const denominator = max ? Math.max(total, max) : total || 1;
  
  const addedWidth = (added / denominator) * 100;
  const removedWidth = (removed / denominator) * 100;

  return (
    <div data-diff-stat-pill="" data-added={added} data-removed={removed} title={fileName ? `${fileName} (+${added} -${removed})` : `+${added} -${removed}`}>
      {fileName && <span data-diff-stat-filename="">{fileName}</span>}
      
      <div data-diff-stat-numbers="">
        <span data-diff-stat-num="added">+{added}</span>
        <span data-diff-stat-num="removed">−{removed}</span>
      </div>
      
      <div data-diff-stat-bar-container="">
        {added > 0 && (
          <div 
            data-diff-stat-bar="added" 
            style={{ width: `${addedWidth}%` }} 
          />
        )}
        {removed > 0 && (
          <div 
            data-diff-stat-bar="removed" 
            style={{ width: `${removedWidth}%` }} 
          />
        )}
      </div>
    </div>
  );
}
