import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HandoffCard } from '../src/components/HandoffCard';
import { initials } from '../src/components/agentOps.shared';

describe('initials', () => {
  it('ignores parentheticals and punctuation tokens', () => {
    expect(initials('Priya (Support lead)')).toBe('P');
    expect(initials('Ada Lovelace [ops]')).toBe('AL');
    expect(initials('— Grace / Hopper —')).toBe('GH');
    expect(initials('claude-gh-git')).toBe('CG');
    expect(initials('agent_2.runner')).toBe('A2');
  });

  it('falls back to the bracketed text when nothing else is left', () => {
    expect(initials('(Support lead)')).toBe('SL');
    expect(initials('')).toBe('');
  });
});

describe('HandoffCard', () => {
  it('renders letter-only initials for a recipient with a role aside', () => {
    const { container } = render(
      <HandoffCard from="triage-agent" to="Priya (Support lead)" reason="Refund over limit" urgency="now" />,
    );
    const avatars = Array.from(container.querySelectorAll('.handoff-av')).map((n) => n.textContent);
    expect(avatars).toContain('P');
    expect(avatars.join('')).not.toContain('(');
  });
});
