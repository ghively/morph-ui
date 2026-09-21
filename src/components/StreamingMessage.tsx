import { useMemo, Fragment } from 'react';
import './StreamingMessage.css';

export interface StreamingMessageProps {
  chunks: string[];
  done: boolean;
}

// Minimal markdown parser
// Supports: **bold**, *italic*, `code`, and text
function parseInlineMarkdown(text: string) {
  const parts = [];
  
  
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      parts.push({ type: 'bold', content: token.slice(2, -2) });
    } else if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      parts.push({ type: 'italic', content: token.slice(1, -1) });
    } else if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      parts.push({ type: 'code', content: token.slice(1, -1) });
    } else if (token) {
      parts.push({ type: 'text', content: token });
    }
  }

  return parts;
}

// Simple block parser for code blocks
function renderMarkdownLite(text: string) {
  // Simple code block detection (```...```)
  const blockTokens = text.split(/(```[\s\S]*?```)/g);
  
  return blockTokens.map((block, i) => {
    if (block.startsWith('```') && block.endsWith('```')) {
      // It's a code block
      const contentLines = block.slice(3, -3).split('\n');
      const lang = contentLines[0]?.trim() || '';
      const codeContent = contentLines.slice(lang ? 1 : 0).join('\n').trim();
      return (
        <pre key={i} data-streaming-message-codeblock="">
          <code data-lang={lang}>{codeContent}</code>
        </pre>
      );
    } else if (block) {
      // Parse inline within this block
      // Split by newlines for basic paragraph handling
      const lines = block.split(/\n\n+/);
      return lines.map((line, j) => {
          const inlines = parseInlineMarkdown(line);
          return (
              <p key={`${i}-${j}`} data-streaming-message-p="">
                  {inlines.map((part, k) => {
                      if (part.type === 'bold') return <strong key={k}>{part.content}</strong>;
                      if (part.type === 'italic') return <em key={k}>{part.content}</em>;
                      if (part.type === 'code') return <code data-streaming-message-inline-code="" key={k}>{part.content}</code>;
                      return <Fragment key={k}>{part.content}</Fragment>;
                  })}
              </p>
          );
      });
    }
    return null;
  });
}


export function StreamingMessage({ chunks, done }: StreamingMessageProps) {
  const fullText = useMemo(() => chunks.join(''), [chunks]);

  return (
    <div data-streaming-message="">
      <div data-streaming-message-content="">
        {renderMarkdownLite(fullText)}
        {!done && <span data-streaming-message-caret="" aria-hidden="true" />}
      </div>
    </div>
  );
}
