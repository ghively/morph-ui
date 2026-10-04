import { useEffect, useState } from 'react';
import { TextFlip } from '../../src/components/TextFlip';
import { Button } from '../../src/components/Button';

const frame: React.CSSProperties = {
  padding: 'var(--s7) var(--s6)',
  color: 'var(--app-text)',
  background: 'var(--app-panel)',
  borderRadius: 'var(--r-pane)',
  maxWidth: '640px',
  margin: 'var(--s6) auto',
  border: '1px solid var(--app-line)',
};

const actions: React.CSSProperties = { marginTop: 'var(--s5)' };

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
      <p style={{ margin: '1rem 0 0 0', color: 'var(--app-dim)', fontSize: 'var(--t-body)' }}>
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
        <span style={{ fontSize: 'var(--t-body)', color: 'var(--app-dim)', marginLeft: 'var(--s2)' }}>
          tokens/s
        </span>
      </h2>
      <div style={actions}>
        <Button size="sm" onClick={() => setIndex((value) => (value + 1) % values.length)}>
          Next value
        </Button>
      </div>
    </div>
  );
};

export const HeadingTag = () => {
  const [index, setIndex] = useState(0);
  const headlines = ['Wave 7 shipped', 'Wave 8 planned'];

  return (
    <div style={frame}>
      <div style={{ fontSize: 'var(--t-h2)', fontWeight: 700, lineHeight: 1.2 }}>
        <TextFlip text={headlines[index]} as="h1" />
      </div>
      <div style={actions}>
        <Button size="sm" onClick={() => setIndex((value) => (value + 1) % headlines.length)}>
          Flip headline
        </Button>
      </div>
    </div>
  );
};
