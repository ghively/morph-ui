import type { StoryDefault, Story } from '@ladle/react';
import { HeroPanel } from './HeroPanel';
import { TextField } from './TextField';
import { Button } from './Button';
import { Link } from './Link';

export default {
  title: 'HeroPanel',
} satisfies StoryDefault;

export const Launcher: Story = () => (
  <div style={{ height: '100vh', background: 'var(--app-bg)' }}>
    <HeroPanel 
      title="Where should we start?"
      description="You have 3 active connections"
      ornament="mark"
      groups={[
        {
          id: 'recent',
          label: 'Recent',
          stagger: true,
          chips: [
            { id: '1', label: 'AI Team', prefix: '# ', onSelect: () => {} },
            { id: '2', label: 'Design Sync', prefix: '# ', onSelect: () => {} }
          ]
        },
        {
          id: 'agents',
          label: 'Agents',
          stagger: false,
          chips: [
            { id: '3', label: 'Reviewer', tag: 'v1.2', onSelect: () => {} },
            { id: '4', label: 'Builder', tag: 'v2.0', onSelect: () => {} }
          ]
        }
      ]}
      actions={
        <>
          <button data-btn="text">New space</button>
          <button data-btn="fill">New room</button>
        </>
      }
    />
  </div>
);

export const LoadingTile: Story = () => (
  <div style={{ height: '100vh', background: 'var(--app-bg)' }}>
    <HeroPanel 
      title="Starting"
      description="Opening your encrypted local store…"
      ornament="tile"
      busy
    />
  </div>
);

export const ActionTile: Story = () => (
  <div style={{ height: '100vh', background: 'var(--app-bg)' }}>
    <HeroPanel 
      title="Couldn't start"
      description="The Matrix client failed to start."
      ornament="tile"
      actions={
        <>
          <button data-btn="">Reload</button>
          <button data-btn="text">Sign out</button>
        </>
      }
    />
  </div>
);

export const WithBody: Story = () => (
  <div style={{ height: '100vh', background: 'var(--app-bg)' }}>
    <HeroPanel
      title="Get early access"
      description="We'll email you an invite when your workspace is ready."
      ornament="mark"
      titleSize="h1"
      maxWidth={440}
      actions={<Link tone="muted" href="#sign-in">Already have an account? Sign in</Link>}
    >
      <form aria-label="Request access" onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
        <TextField label="Work email" type="email" name="email" autoComplete="email" placeholder="you@company.com" />
        <Button type="submit" variant="primary" size="lg">Request invite</Button>
      </form>
    </HeroPanel>
  </div>
);
