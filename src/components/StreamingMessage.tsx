import { useState } from 'react';
import './StreamingMessage.css';
import { useStream, renderMd, type StreamProps } from './agentOps.shared';

export function StreamingMessage(props: StreamProps) {
  const { done, label, className = '' } = props;
  const s = useStream(props);
  const [copied, setCopied] = useState(false);
  const caret = !done ? <span className="streaming-message-caret" data-streaming-message-caret="" aria-hidden="true"><i /><i /><i /></span> : null;
  const copy = () => { navigator.clipboard?.writeText(s.text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <article className={'streaming-message ' + className} data-streaming-message="" data-done={done ? '' : undefined} aria-busy={!done}>
      <div className="streaming-message-body" data-streaming-message-content="">{renderMd(s.text, caret)}{!s.text && caret}</div>
      <footer className="streaming-message-foot">
        {label && <span className="streaming-message-who">{label}</span>}
        <span role="status">{done ? s.words + ' words' : 'Writing · ' + s.words + ' words'}</span>
        {done && <button type="button" className="streaming-message-copy" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>}
      </footer>
    </article>
  );
}

export type { StreamProps as StreamingMessageProps } from './agentOps.shared';
