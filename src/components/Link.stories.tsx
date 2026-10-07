import type { Story, StoryDefault } from '@ladle/react';
import { Link } from './Link';

export default {
  title: 'Link',
} satisfies StoryDefault;

const surface = { padding: 'var(--s6)', background: 'var(--app-bg)', color: 'var(--app-text)', fontSize: 'var(--t-lead)' };

export const Default: Story = () => (
  <div style={surface}>
    <p style={{ display: 'flex', gap: 'var(--s5)', margin: 0 }}>
      <Link href="#docs">Read the docs</Link>
      <Link href="https://example.com" external>Status page</Link>
    </p>
  </div>
);

export const Muted: Story = () => (
  <div style={surface}>
    <nav aria-label="Legal">
      <p style={{ display: 'flex', gap: 'var(--s5)', margin: 0, fontSize: 'var(--t-ctl)' }}>
        <Link tone="muted" href="#terms">Terms of service</Link>
        <Link tone="muted" href="#privacy">Privacy policy</Link>
        <Link tone="muted" href="#help">Help</Link>
      </p>
    </nav>
  </div>
);

export const InlineInText: Story = () => (
  <div style={surface}>
    <p style={{ margin: 0, maxWidth: 420, lineHeight: 1.5 }}>
      Your workspace syncs every few minutes. If something looks stale, check the{' '}
      <Link href="#activity">activity log</Link> or read{' '}
      <Link href="https://example.com/sync" external>how sync works</Link>.
    </p>
  </div>
);

export const AsButton: Story = () => (
  <div style={surface}>
    <p style={{ display: 'flex', gap: 'var(--s5)', alignItems: 'center', margin: 0 }}>
      <span style={{ color: 'var(--app-dim)' }}>Didn't get it?</span>
      <Link onClick={() => {}}>Resend code</Link>
      <Link tone="muted" onClick={() => {}}>Use a different account</Link>
      <Link disabled onClick={() => {}}>Resend (wait 30s)</Link>
    </p>
  </div>
);
