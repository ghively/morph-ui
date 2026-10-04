import { useEffect, useState } from 'react';
import { TextHighlight } from './TextHighlight';

// Themed from tokens so the story renders in the library's own type and
// surfaces (a hard-coded system-ui stack rendered italics differently per host).
const frame: React.CSSProperties = {
  padding: 'var(--s9) var(--s7)',
  fontFamily: 'var(--font-sans)',
  color: 'var(--app-text)',
  background: 'var(--app-panel)',
  borderRadius: 'var(--r-xl)',
  maxWidth: '640px',
  margin: 'var(--s7) auto',
  border: '1px solid var(--app-line)',
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
          color: 'var(--on-accent)',
          backgroundColor: 'var(--app-blue)',
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
