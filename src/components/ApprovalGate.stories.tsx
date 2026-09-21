import { useState } from 'react';
import { ApprovalGate } from './ApprovalGate';

const frame: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '560px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const outcomeStyle: React.CSSProperties = {
  marginTop: '1rem',
  fontSize: '0.8125rem',
  color: '#64748b',
};

export const Default = () => {
  const [outcome, setOutcome] = useState<string | null>(null);

  return (
    <div style={frame}>
      <ApprovalGate
        title="Deploy to gh-media"
        description="This playbook run restarts the media stack containers. Expect roughly 30 seconds of downtime for Plex and the transcode workers."
        riskLevel="medium"
        actionSummary="ansible-playbook site.yml --limit gh_media"
        onResolve={(approved, comment) =>
          setOutcome(`${approved ? 'Approved' : 'Denied'}${comment ? ` — "${comment}"` : ''}`)
        }
      />
      <p style={outcomeStyle}>{outcome ?? 'Awaiting a decision…'}</p>
    </div>
  );
};

export const HighRisk = () => {
  const [outcome, setOutcome] = useState<string | null>(null);

  return (
    <div style={frame}>
      <ApprovalGate
        title="Rotate the GitLab deploy token"
        description="Rotating this credential invalidates the current token immediately. Any runner still holding the old value will fail its next job until the new secret propagates."
        riskLevel="high"
        actionSummary="op item edit 'GitLab Deploy Token' --vault Gregory"
        onResolve={(approved, comment) =>
          setOutcome(`${approved ? 'Approved' : 'Denied'}${comment ? ` — "${comment}"` : ''}`)
        }
      />
      <p style={outcomeStyle}>{outcome ?? 'Awaiting a decision…'}</p>
    </div>
  );
};

export const LowRisk = () => {
  const [outcome, setOutcome] = useState<string | null>(null);

  return (
    <div style={frame}>
      <ApprovalGate
        title="Run the catalog build"
        description="Read-only verification step. Builds the Ladle catalog into the gitignored build/ directory."
        riskLevel="low"
        actionSummary="pnpm catalog:build"
        onResolve={(approved) => setOutcome(approved ? 'Approved' : 'Denied')}
      />
      <p style={outcomeStyle}>
        {outcome ?? 'Low risk hides the comment field — approve or deny directly.'}
      </p>
    </div>
  );
};
