import './CodeBlockCard.css';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface CodeBlockCardProps {
  code: string;
  language?: string;
  headLabel?: string;
  copyFeedbackMs?: number;
  onCopy?: (code: string) => void;
  headEnd?: ReactNode;
  copyAriaLabel?: string;
  className?: string;
}

export function CodeBlockCard({
  code,
  language = 'text',
  headLabel,
  copyFeedbackMs = 1400,
  onCopy,
  headEnd,
  copyAriaLabel = 'Copy code',
  className = ''
}: CodeBlockCardProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    if (copied) {
      timer = window.setTimeout(() => {
        setCopied(false);
      }, copyFeedbackMs);
    }
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [copied, copyFeedbackMs]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    if (onCopy) onCopy(code);
  };

  return (
    <div data-code="" className={className}>
      <div data-codehead="">
        <span data-num="">{headLabel ?? language}</span>
        {headEnd}
        <button 
          data-btn="text" 
          data-state="" 
          style={{ marginLeft: "auto", padding: "3px var(--s3)", fontSize: "var(--t-meta)" }} 
          aria-label={copyAriaLabel}
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}
