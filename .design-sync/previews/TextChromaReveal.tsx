import { useState } from 'react';
import { TextChromaReveal } from '../../src/components/TextChromaReveal';

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

export const Default = () => {
  const [reveal, setReveal] = useState(true);

  return (
    <div style={frame}>
      <TextChromaReveal text="Chromatic aberration" as="h2" reveal={reveal} />
      <div>
      <button
        type="button"
        onClick={() => setReveal((value) => !value)}
        style={{
          marginTop: '1.75rem',
          padding: '0.5rem 1rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#ffffff',
          backgroundColor: '#6366f1',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        {reveal ? 'Scatter channels' : 'Reveal text'}
      </button>
      </div>
    </div>
  );
};

const STAGES = [
  { label: 'Retrieving sources', reveal: true },
  { label: 'Ranking passages', reveal: true },
  { label: 'Drafting answer', reveal: false },
];

export const Scattered = () => (
  <div style={{ ...frame, textAlign: 'left' }}>
    {STAGES.map((stage) => (
      <div key={stage.label} style={{ minHeight: '1.75rem', fontSize: '1.125rem', fontWeight: 600 }}>
        <TextChromaReveal text={stage.label} as="div" reveal={stage.reveal} />
      </div>
    ))}
    <p style={{ margin: '1rem 0 0 0', color: '#a5b4fc', fontSize: '0.875rem' }}>
      reveal=false keeps every channel clipped — the third stage stays hidden until it starts.
    </p>
  </div>
);

export const Revealed = () => (
  <div style={frame}>
    <TextChromaReveal text="Signal locked" as="h2" reveal className="hero-title" />
    <p style={{ margin: '1rem 0 0 0', color: '#a5b4fc', fontSize: '0.875rem' }}>
      Revealed state — channels converge onto the base layer.
    </p>
  </div>
);
