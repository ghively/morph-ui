import type { StoryDefault, Story } from '@ladle/react';
import { useEffect, useState } from 'react';
import { StreamingMessage } from './StreamingMessage';

const frame: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '640px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const script = [
  'Running the gates now. ',
  '**Typecheck** is clean and ',
  '`pnpm lint` reports *0 errors*.\n\n',
  'The catalog build writes to a gitignored directory:\n\n',
  '```bash\npnpm catalog:build\n```',
];

export const Default = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count >= script.length) return;
    const timer = window.setTimeout(() => setCount((value) => value + 1), 700);
    return () => window.clearTimeout(timer);
  }, [count]);

  const done = count >= script.length;

  return (
    <div style={frame}>
      <StreamingMessage chunks={script.slice(0, count)} done={done} />
      <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
        {done ? 'Stream complete — the caret is gone.' : 'Streaming… a caret trails the text.'}
      </p>
    </div>
  );
};

export const Streaming = () => (
  <div style={frame}>
    <StreamingMessage
      chunks={['Inspecting the repo', ' and reading the ', '**props interfaces**']}
      done={false}
    />
  </div>
);

export const CompleteWithMarkdown = () => (
  <div style={frame}>
    <StreamingMessage
      chunks={[
        'All four gates passed on **batch 2**.\n\n',
        'The `ModelSelector` popover only renders a search field when there are *more than eight* models.\n\n',
        '```tsx\nconst showSearch = models.length > 8;\n```',
      ]}
      done
    />
  </div>
);
