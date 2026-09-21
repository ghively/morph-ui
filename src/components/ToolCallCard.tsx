import { useState, useMemo } from 'react';
import './ToolCallCard.css';

export interface ToolCallCardProps {
  toolName: string;
  args: Record<string, unknown>;
  status: 'pending' | 'running' | 'succeeded' | 'failed';
  duration?: number; // in milliseconds
  result?: unknown;
  error?: string;
  defaultExpanded?: boolean;
}

export function ToolCallCard({
  toolName,
  args,
  status,
  duration,
  result,
  error,
  defaultExpanded = false,
}: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const argChips = useMemo(() => {
    return Object.entries(args).slice(0, 3).map(([key, value]) => {
      let displayValue = String(value);
      if (typeof value === 'object') {
        displayValue = '{...}';
      } else if (displayValue.length > 20) {
        displayValue = displayValue.substring(0, 20) + '...';
      }
      return { key, displayValue };
    });
  }, [args]);
  
  const hasMoreArgs = Object.keys(args).length > 3;

  const rawJson = useMemo(() => {
    const data: Record<string, unknown> = { args };
    if (result !== undefined) data.result = result;
    if (error !== undefined) data.error = error;
    return JSON.stringify(data, null, 2);
  }, [args, result, error]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div data-tool-call-card="" data-status={status}>
      <div data-tool-call-header="" onClick={toggleExpanded} role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpanded(); }}}>
        <div data-tool-call-indicator="">
          {status === 'pending' && <div data-tool-call-dot="" className="is-pending" />}
          {status === 'running' && <div data-tool-call-dot="" className="is-running" />}
          {status === 'succeeded' && <div data-tool-call-dot="" className="is-succeeded" />}
          {status === 'failed' && <div data-tool-call-dot="" className="is-failed" />}
        </div>
        
        <div data-tool-call-title="">{toolName}</div>
        
        <div data-tool-call-args-summary="">
          {argChips.map((chip) => (
            <span key={chip.key} data-tool-call-chip="">
              <span className="chip-key">{chip.key}:</span> <span className="chip-value">{chip.displayValue}</span>
            </span>
          ))}
          {hasMoreArgs && <span data-tool-call-chip="">...</span>}
        </div>
        
        <div data-tool-call-meta="">
          {duration !== undefined && <span data-tool-call-duration="">{duration}ms</span>}
          <span data-tool-call-chevron="" className={expanded ? 'is-expanded' : ''}>▼</span>
        </div>
      </div>
      
      {status === 'failed' && error && !expanded && (
          <div data-tool-call-error-excerpt="">
              {error.length > 80 ? error.substring(0, 80) + '...' : error}
          </div>
      )}

      {expanded && (
        <div data-tool-call-details="">
          <pre data-tool-call-raw-json="">
            {rawJson}
          </pre>
        </div>
      )}
    </div>
  );
}
