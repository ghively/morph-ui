import type { StoryDefault, Story } from '@ladle/react';
import { TextCycle } from './TextCycle';

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
    <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>
      Built for{' '}
      <TextCycle items={['agents', 'operators', 'reviewers', 'humans']} />
    </h2>
    <p style={{ margin: '1rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
      Cycles every 2s and pauses while hovered.
    </p>
  </div>
);

export const FastCycle = () => (
  <div style={frame}>
    <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>
      <TextCycle
        items={['Planning', 'Coding', 'Reviewing', 'Deploying']}
        interval={900}
      />
    </h2>
    <p style={{ margin: '1rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
      900ms interval for a rapid status ticker.
    </p>
  </div>
);

export const NoPauseOnHover = () => (
  <div style={frame}>
    <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>
      <TextCycle
        items={['12 tasks queued', '3 agents active', '0 failures']}
        interval={1600}
        pauseOnHover={false}
        as="span"
        className="status-ticker"
      />
    </h2>
    <p style={{ margin: '1rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
      Keeps cycling even when the pointer is over it.
    </p>
  </div>
);
