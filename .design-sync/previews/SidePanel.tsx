import { SidePanel } from '../../src/components/SidePanel';
import { StatusRowList } from '../../src/components/StatusRowList';

const ROOMS = [
  { id: 'design', dot: true, tone: 'ok' as const, live: true, title: '# design-review', meta: '6 members · Priya is typing', badges: [{ id: 'u', label: '3 new', solid: true }] },
  { id: 'eval', dot: true, tone: 'ok' as const, title: '# eval-runs', meta: 'Nightly regression finished 12m ago' },
  { id: 'incidents', dot: true, tone: 'danger' as const, title: '# incidents', meta: 'Retriever latency over SLO', badges: [{ id: 'm', label: '@you', tone: 'danger' as const }] },
  { id: 'billing', dot: true, tone: 'warn' as const, title: '# billing-agents', meta: 'Approval waiting on refund #4821' },
  { id: 'random', dot: true, title: '# random', meta: 'Quiet since yesterday' },
];

export const Default = () => {
  return (
    <div style={{ position: 'relative', width: 300, height: 560, background: 'var(--app-panel)', borderRadius: 'var(--r-pane)', overflow: 'hidden' }}>
      <SidePanel
        open={true}
        slot="drawer"
        title="Rooms"
        subtitle="Northwind · 5 joined"
        icon={<span>#</span>}
        onClose={() => {}}
        bodyId="rooms-body"
      >
        <StatusRowList rows={ROOMS} label="Joined rooms" flush />
      </SidePanel>
    </div>
  );
};
