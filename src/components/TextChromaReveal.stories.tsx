import { useEffect, useState } from 'react';
import { TextChromaReveal } from './TextChromaReveal';

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
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReveal(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div style={frame}>
      <TextChromaReveal text="Chromatic aberration" as="h2" reveal={reveal} />
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
  );
};

export const Scattered = () => (
  <div style={frame}>
    <TextChromaReveal text="Signal lost" as="h2" reveal={false} />
    <p style={{ margin: '1rem 0 0 0', color: '#a5b4fc', fontSize: '0.875rem' }}>
      Resting state — the red, green and blue layers stay offset.
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
