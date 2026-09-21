import type { StoryDefault, Story } from '@ladle/react';
import { useEffect, useState } from 'react';
import { TextMorphing } from './TextMorphing';

const frame: React.CSSProperties = {
  padding: '3rem 2rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: '#f8fafc',
  background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #09090b 100%)',
  borderRadius: '16px',
  maxWidth: '640px',
  margin: '2rem auto',
  border: '1px solid #4338ca',
  textAlign: 'center',
};

const buttonStyle: React.CSSProperties = {
  marginTop: '1.75rem',
  padding: '0.5rem 1rem',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#ffffff',
  backgroundColor: '#6366f1',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const phases = ['Thinking', 'Searching', 'Writing', 'Verifying'];

export const Default = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % phases.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div style={frame}>
      <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
        <TextMorphing text={phases[index]} />
      </h2>
      <p style={{ margin: '1rem 0 0 0', color: '#a5b4fc', fontSize: '0.875rem' }}>
        Gooey blend morph runs on every text change.
      </p>
    </div>
  );
};

export const ManualMorph = () => {
  const [index, setIndex] = useState(0);
  const labels = ['0 errors', '3 warnings', '69 stories'];

  return (
    <div style={frame}>
      <TextMorphing text={labels[index]} as="h1" className="morph-headline" />
      <button
        type="button"
        onClick={() => setIndex((value) => (value + 1) % labels.length)}
        style={buttonStyle}
      >
        Morph to next label
      </button>
    </div>
  );
};
