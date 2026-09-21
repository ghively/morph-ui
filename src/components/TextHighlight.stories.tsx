import type { StoryDefault, Story } from '@ladle/react';
import { useEffect, useState } from 'react';
import { TextHighlight } from './TextHighlight';

const frame: React.CSSProperties = {
  padding: '3rem 2rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: '#f8fafc',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  borderRadius: '16px',
  maxWidth: '640px',
  margin: '2rem auto',
  border: '1px solid #334155',
  lineHeight: 1.7,
};

export const Default = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div style={frame}>
      <p style={{ margin: 0, fontSize: '1.25rem' }}>
        Every change is verified before it ships —{' '}
        <TextHighlight text="evidence before success" active={active} /> is the
        rule, not the exception.
      </p>
      <button
        type="button"
        onClick={() => setActive((value) => !value)}
        style={{
          marginTop: '1.75rem',
          padding: '0.5rem 1rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#0f172a',
          backgroundColor: '#38bdf8',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        {active ? 'Clear highlight' : 'Draw highlight'}
      </button>
    </div>
  );
};

export const Inactive = () => (
  <div style={frame}>
    <p style={{ margin: 0, fontSize: '1.25rem' }}>
      Waiting to scroll into view:{' '}
      <TextHighlight text="not yet highlighted" />
    </p>
  </div>
);

export const EmphasisTag = () => (
  <div style={frame}>
    <p style={{ margin: 0, fontSize: '1.25rem' }}>
      The gate that matters is{' '}
      <TextHighlight
        text="pnpm typecheck && pnpm lint"
        active
        as="em"
        className="inline-code-highlight"
      />
      .
    </p>
  </div>
);
