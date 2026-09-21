import { useEffect, useState } from 'react';
import { TextFlip } from './TextFlip';

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

const buttonStyle: React.CSSProperties = {
  marginTop: '1.75rem',
  padding: '0.5rem 1rem',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#0f172a',
  backgroundColor: '#38bdf8',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const statuses = ['Queued', 'Running', 'Verifying', 'Deployed'];

export const Default = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % statuses.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div style={frame}>
      <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>
        Status: <TextFlip text={statuses[index]} />
      </h2>
      <p style={{ margin: '1rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
        Vertical flip fires whenever the text prop changes.
      </p>
    </div>
  );
};

export const Horizontal = () => {
  const [index, setIndex] = useState(0);
  const values = ['12', '48', '176', '1024'];

  return (
    <div style={frame}>
      <h2 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 700 }}>
        <TextFlip
          text={values[index]}
          direction="horizontal"
          className="metric-value"
        />
        <span style={{ fontSize: '1rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
          tokens/s
        </span>
      </h2>
      <button
        type="button"
        onClick={() => setIndex((value) => (value + 1) % values.length)}
        style={buttonStyle}
      >
        Next value
      </button>
    </div>
  );
};

export const HeadingTag = () => {
  const [index, setIndex] = useState(0);
  const headlines = ['Wave 7 shipped', 'Wave 8 planned'];

  return (
    <div style={frame}>
      <TextFlip text={headlines[index]} as="h1" />
      <button
        type="button"
        onClick={() => setIndex((value) => (value + 1) % headlines.length)}
        style={buttonStyle}
      >
        Flip headline
      </button>
    </div>
  );
};
