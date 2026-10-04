import './ToolCallCard.css';
import { useToolCall, JsonView, cv, type ToolCallProps } from './agentOps.shared';

export function ToolCallCard(props: ToolCallProps) {
  const t = useToolCall(props);
  const { toolName, status, error, className = '' } = props;
  return (
    <div className={'tool-call ' + className} data-tool-call-card="" data-status={status} data-open={t.open ? '' : undefined} style={cv(t.color)}>
      <div className="tool-call-head" data-tool-call-header="" {...t.head}>
        <span className="tool-call-ind" data-tool-call-indicator="" aria-label={t.label}>
          {status === 'running' ? <i className="tool-call-spin" /> : <b>{status === 'succeeded' ? '✓' : status === 'failed' ? '✕' : ''}</b>}
        </span>
        <span className="tool-call-name" data-tool-call-title="">{toolName}</span>
        <span className="tool-call-args" data-tool-call-args-summary="">
          {t.chips.map(c => <span key={c.key} className="tool-call-chip" data-tool-call-chip=""><em>{c.key}</em>{c.value}</span>)}
          {t.more > 0 && <span className="tool-call-chip" data-tool-call-chip="" data-tool-call-more="" title={t.more + ' more argument' + (t.more === 1 ? '' : 's')}>{'+' + t.more}</span>}
        </span>
        <span className="tool-call-meta" data-tool-call-meta="">
          {t.dur && <span data-tool-call-duration="">{t.dur}</span>}
          <span className="tool-call-chev" data-tool-call-chevron="" aria-hidden="true" />
        </span>
        {status === 'running' && <span className="tool-call-beam" aria-hidden="true" />}
      </div>
      {status === 'failed' && error && !t.open && <div className="tool-call-err" data-tool-call-error-excerpt="">{error.length > 96 ? error.slice(0, 95) + '…' : error}</div>}
      <div className="tool-call-body" aria-hidden={!t.open}>
        <div className="tool-call-in">{t.open && <div data-tool-call-details=""><JsonView text={t.json} className="tool-call-json" /></div>}</div>
      </div>
    </div>
  );
}

export type { ToolCallProps as ToolCallCardProps } from './agentOps.shared';
