import type { StoryDefault, Story } from '@ladle/react';
import { HeroPanel } from './HeroPanel';

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
