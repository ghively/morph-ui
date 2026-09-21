import { useState } from 'react';
import { Tabs } from './Tabs';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'sources', label: 'Sources', badge: 12 },
  { id: 'activity', label: 'Activity' },
];

const PANELS: Record<string, string> = {
  overview: ' blended KPI summary across every department.',
  sources: '12 connected sources, 10 fresh.',
  activity: 'Index runs, query log, and agent actions.',
};

export default {
  title: 'Tabs',
  component: Tabs,
};

export const Default = () => {
  const [activeId, setActiveId] = useState('overview');
  return (
    <Tabs tabs={TABS} activeId={activeId} onTabChange={setActiveId} label="Dashboard sections">
      <p style={{ margin: 0 }}>{PANELS[activeId]}</p>
    </Tabs>
  );
};

export const WithoutPanel = () => {
  const [activeId, setActiveId] = useState('sources');
  return <Tabs tabs={TABS} activeId={activeId} onTabChange={setActiveId} />;
};
