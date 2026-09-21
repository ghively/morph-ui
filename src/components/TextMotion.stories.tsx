import { useEffect, useState } from 'react';
import { TextMotion } from './TextMotion';

const frame: React.CSSProperties = {
  padding: '3rem 2rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: '#f8fafc',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  borderRadius: '16px',
  maxWidth: '640px',
  margin: '2rem auto',
  border: '1px solid #334155',
};

export const Default = () => (
  <div style={frame}>
    <TextMotion
      text="Concept reference components, not app code"
      as="h2"
      staggerDelay={60}
    />
    <p style={{ margin: '1rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
      Words enter with the slide-fade-scale preset at a 60ms stagger.
    </p>
  </div>
);

export const Presets = () => {
  const presets = ['slide-fade-scale', 'fade-scale', 'slide-fade'] as const;

  return (
    <div style={frame}>
      {presets.map((preset) => (
        <div key={preset} style={{ marginBottom: '1.75rem' }}>
          <div
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: '0.375rem',
            }}
          >
            {preset}
          </div>
          <TextMotion text="Ship it and verify" preset={preset} as="h3" />
        </div>
      ))}
    </div>
  );
};

export const ToggleActive = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div style={frame}>
      <TextMotion
        text="Every gate is green"
        active={active}
        preset="slide-fade"
        staggerDelay={80}
        as="h2"
        className="hero-line"
      />
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
        {active ? 'Reset' : 'Animate in'}
      </button>
    </div>
  );
};
