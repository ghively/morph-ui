import { TextGlitch } from './TextGlitch';

const frame: React.CSSProperties = {
  padding: '3rem 2rem',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  color: '#f8fafc',
  background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
  borderRadius: '16px',
  maxWidth: '640px',
  margin: '2rem auto',
  border: '1px solid #3f3f46',
  textAlign: 'center',
};

export const Default = () => (
  <div style={frame}>
    <TextGlitch text="CONNECTION UNSTABLE" as="h2" />
    <p style={{ margin: '1rem 0 0 0', color: '#a1a1aa', fontSize: '0.8125rem' }}>
      Medium intensity — the default RGB split.
    </p>
  </div>
);

export const Intensities = () => {
  const intensities = ['low', 'medium', 'high'] as const;

  return (
    <div style={frame}>
      {intensities.map((intensity) => (
        <div key={intensity} style={{ marginBottom: '2rem' }}>
          <div
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#71717a',
              marginBottom: '0.5rem',
            }}
          >
            {intensity}
          </div>
          <TextGlitch text="SYSTEM FAILURE" intensity={intensity} as="h3" />
        </div>
      ))}
    </div>
  );
};

export const HighIntensityBanner = () => (
  <div style={frame}>
    <TextGlitch
      text="AGENT OFFLINE"
      intensity="high"
      as="h1"
      className="alert-banner"
    />
    <p style={{ margin: '1rem 0 0 0', color: '#a1a1aa', fontSize: '0.8125rem' }}>
      High intensity for critical alert states.
    </p>
  </div>
);
