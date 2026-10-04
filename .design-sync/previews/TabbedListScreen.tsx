import { useState } from 'react';
import { TabbedListScreen } from '../../src/components/TabbedListScreen';
import { StatusRowList } from '../../src/components/StatusRowList';
import { Button } from '../../src/components/Button';

const AGENTS = [
  { id: 'triage', dot: true, tone: 'ok' as const, live: true, title: 'Support triage', identifier: 'agent/support-triage', meta: 'Routing 14 tickets · last run 2m ago', badges: [{ id: 'star', label: 'Starred' }] },
  { id: 'refunds', dot: true, tone: 'warn' as const, title: 'Refund reviewer', identifier: 'agent/refund-review', meta: 'Waiting on approval for refund #4821' },
  { id: 'digest', dot: true, tone: 'ok' as const, title: 'Weekly KPI digest', identifier: 'agent/kpi-digest', meta: 'Scheduled · Mondays 08:45' },
  { id: 'crawler', dot: true, tone: 'danger' as const, title: 'Docs crawler', identifier: 'agent/docs-crawler', meta: 'Failed: 403 from confluence.internal', error: 'Credential expired — reconnect the source.' },
];

export const Default = () => {
  const [activeTab, setActiveTab] = useState('t1');
  return (
    <div style={{ height: '400px', border: '1px solid var(--app-line)' }}>
      <TabbedListScreen
        tabs={[
          { id: 't1', label: 'All Agents', count: 12 },
          { id: 't2', label: 'Starred', count: 3 },
          { id: 't3', label: 'Archived' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tablistLabel="Agent Views"
      >
        <StatusRowList rows={AGENTS} label="Agents" flush />
      </TabbedListScreen>
    </div>
  );
};

export const WithSearchAndToolbar = () => {
  const [activeTab, setActiveTab] = useState('t1');
  const [searchQuery, setSearchQuery] = useState('');
  const rows = AGENTS.filter((a) => a.tone !== 'danger');

  return (
    <div style={{ height: '400px', border: '1px solid var(--app-line)' }}>
      <TabbedListScreen
        tabs={[
          { id: 't1', label: 'Active', count: rows.length },
          { id: 't2', label: 'Inactive', count: 1 }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tablistLabel="Status Views"
        accent="blue"
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Search agents…',
          ariaLabel: 'Search agents'
        }}
        toolbarEnd={<Button size="sm" variant="primary">New agent</Button>}
      >
        <StatusRowList rows={rows} label="Active agents" flush />
      </TabbedListScreen>
    </div>
  );
};
