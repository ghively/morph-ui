import type { StoryDefault, Story } from '@ladle/react';
import { useState } from 'react';
import { AgentCard, type AgentStatus } from './AgentCard';

const avatar = (initials: string, bg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">` +
      `<rect width="48" height="48" rx="12" fill="${bg}"/>` +
      `<text x="24" y="31" font-family="system-ui, sans-serif" font-size="17" font-weight="600" fill="#f8fafc" text-anchor="middle">${initials}</text>` +
      `</svg>`
  )}`;

const frame: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '420px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const grid: React.CSSProperties = {
  padding: '2rem',
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  maxWidth: '900px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const avatarImg = (initials: string, bg: string) => (
  <img
    src={avatar(initials, bg)}
    alt=""
    width={48}
    height={48}
    style={{ display: 'block', borderRadius: '12px' }}
  />
);

export const Default = () => (
  <div style={frame}>
    <AgentCard
      name="claude-gh-ai"
      role="Heavy executor"
      status="working"
      capabilities={['ansible', 'typescript', 'code-review']}
      lastActive="2 minutes ago"
    >
      {avatarImg('CA', '#4338ca')}
    </AgentCard>
  </div>
);

export const AllStatuses = () => {
  const agents: { name: string; role: string; status: AgentStatus; initials: string; bg: string }[] = [
    { name: 'claude-gh-git', role: 'Repo steward', status: 'idle', initials: 'CG', bg: '#0f766e' },
    { name: 'claude-gh-arm', role: 'Mid executor', status: 'busy', initials: 'CR', bg: '#b45309' },
    { name: 'claude-gh-media', role: 'Light executor', status: 'working', initials: 'CM', bg: '#4338ca' },
    { name: 'claude-gh-mac', role: 'Darwin runner', status: 'offline', initials: 'CX', bg: '#475569' },
  ];

  return (
    <div style={grid}>
      {agents.map((agent) => (
        <AgentCard
          key={agent.name}
          name={agent.name}
          role={agent.role}
          status={agent.status}
          capabilities={['a2a', 'verify']}
          lastActive={agent.status === 'offline' ? '3 days ago' : 'just now'}
        >
          {avatarImg(agent.initials, agent.bg)}
        </AgentCard>
      ))}
    </div>
  );
};

export const Focusable = () => {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div style={frame}>
      <AgentCard
        name="jules-lane"
        role="Async GitHub executor"
        status="busy"
        capabilities={['github', 'pnpm', 'ci']}
        lastActive="41 seconds ago"
        onFocus={() => setFocused('jules-lane')}
      >
        {avatarImg('JL', '#be123c')}
      </AgentCard>
      <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
        {focused ? `Focused: ${focused}` : 'Click or press Enter on the card — it is a button when onFocus is set.'}
      </p>
    </div>
  );
};

export const Minimal = () => (
  <div style={frame}>
    <AgentCard name="codex" status="idle" />
  </div>
);
