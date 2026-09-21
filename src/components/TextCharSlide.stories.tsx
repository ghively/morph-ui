import type { StoryDefault, Story } from '@ladle/react';
import { useEffect, useState } from 'react';
import { TextCharSlide } from './TextCharSlide';

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
    <TextCharSlide
      text="Deploying to production"
      as="h2"
      staggerDelay={45}
      initialDelay={120}
    />
    <p style={{ margin: '1rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
      Characters slide up one by one with a 45ms stagger.
    </p>
  </div>
);

export const SlideDirections = () => {
  const directions = ['up', 'down', 'left', 'right'] as const;

  return (
    <div style={frame}>
      {directions.map((direction) => (
        <div key={direction} style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: '0.375rem',
            }}
          >
            {direction}
          </div>
          <TextCharSlide
            text="morph-ui"
            direction={direction}
            as="h3"
            staggerDelay={60}
          />
        </div>
      ))}
    </div>
  );
};

export const ReplayableHeadline = () => {
  const [runId, setRunId] = useState(0);
  const [text, setText] = useState('Build passed');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setText('All gates green');
      setRunId((id) => id + 1);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div style={frame}>
      <TextCharSlide
        key={runId}
        text={text}
        as="h2"
        direction="down"
        staggerDelay={35}
      />
      <button
        type="button"
        onClick={() => setRunId((id) => id + 1)}
        style={{
          marginTop: '1.5rem',
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
        Replay animation
      </button>
    </div>
  );
};
