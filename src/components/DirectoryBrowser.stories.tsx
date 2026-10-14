import type { StoryDefault, Story } from "@ladle/react";
import { DirectoryBrowser } from './DirectoryBrowser';
import { useState } from 'react';

export default {
  title: 'Features/DirectoryBrowser',
} satisfies StoryDefault;

const entries = [
  { id: '1', name: 'General', alias: '#general:example.org', memberLabel: '1,204 members', description: 'Server-wide chatter and announcements.', state: 'none' as const, action: { label: 'Join', kind: 'join' as const, disabled: false } },
  { id: '2', name: 'Agent Ops', alias: '#ops:example.org', memberLabel: '87 members', description: 'Runbooks, alerts, fleet status.', suggested: true, state: 'none' as const, action: { label: 'Join', kind: 'join' as const, disabled: false } },
  { id: '3', name: 'Research Notes', isCollection: true, state: 'none' as const, action: { label: 'Join', kind: 'join' as const, disabled: false } },
  { id: '4', name: 'Standup', memberLabel: '12 members', state: 'invited' as const, action: { label: 'Accept', kind: 'accept' as const, disabled: false } },
  { id: '5', name: 'Vault', memberLabel: 'private', state: 'joined' as const, action: { label: 'Open', kind: 'open' as const, disabled: false } },
];

export const Default: Story = () => {
  const [tab, setTab] = useState<'collections' | 'directory' | 'address'>('directory');
  return (
    <DirectoryBrowser
      tab={tab}
      onTabChange={setTab}
      list={{
        status: 'done',
        entries,
        hasMore: true,
        error: null,
        degraded: false
      }}
      onAct={() => {}}
      onLoadMore={() => {}}
      onClose={() => {}}
    />
  );
};

export const Spaces: Story = () => {
  const [tab, setTab] = useState<'collections' | 'directory' | 'address'>('collections');
  return (
    <DirectoryBrowser
      tab={tab}
      onTabChange={setTab}
      collections={[{ id: 'work', name: 'Work' }, { id: 'lab', name: 'Lab' }]}
      path={['work', 'research']}
      collectionName={(id) => id === 'research' ? 'Research' : id}
      list={{
        status: 'done',
        entries: entries.slice(0, 3),
        hasMore: false,
        error: null,
        degraded: false
      }}
      onAct={() => {}}
      onClose={() => {}}
    />
  );
};

export const ByAddress: Story = () => {
  const [tab, setTab] = useState<'collections' | 'directory' | 'address'>('address');
  const [value, setValue] = useState('#general:example.org');
  return (
    <DirectoryBrowser
      tab={tab}
      onTabChange={setTab}
      list={{ status: 'done', entries: [], hasMore: false, error: null, degraded: false }}
      address={{ value, onChange: setValue, onSubmit: () => {} }}
      onAct={() => {}}
      onClose={() => {}}
    />
  );
};

export const DegradedError: Story = () => (
  <DirectoryBrowser
    tab="directory"
    onTabChange={() => {}}
    list={{
      status: 'done',
      entries: entries.slice(0, 2),
      hasMore: false,
      error: 'Federation lookup failed.',
      degraded: true
    }}
    onAct={() => {}}
    onClose={() => {}}
  />
);
