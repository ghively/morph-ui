import { useState } from 'react';
import { MaintenanceMode } from './MaintenanceMode';

export default {
  title: 'MaintenanceMode',
  component: MaintenanceMode,
};

function Demo({ untilSeconds = 4210, fullscreen = true }: { untilSeconds?: number; fullscreen?: boolean }) {
  const [done, setDone] = useState(false);
  if (done) return <p style={{ padding: 24 }}>Back online.</p>;
  return (
    <MaintenanceMode
      untilSeconds={untilSeconds}
      fullscreen={fullscreen}
      onSubscribe={(email) => console.log('notify', email)}
      onBack={() => setDone(true)}
    >
      We’re replacing the search index. Work saved before 22:00 UTC is safe and
      will be back exactly as you left it.
    </MaintenanceMode>
  );
}

export const ScheduledCountdown = () => <Demo />;

export const AlmostDone = () => <Demo untilSeconds={94} />;

export const InlineWithinAContainer = () => (
  <div style={{ maxWidth: 520, border: '1px dashed rgba(255,255,255,0.2)', padding: 12 }}>
    <p style={{ margin: '0 0 8px' }}>Surface around it stays interactive.</p>
    <MaintenanceMode
      fullscreen={false}
      untilSeconds={187}
      onSubscribe={() => {}}
      title="Index rebuild"
    >
      The knowledge base is rebuilding. Reads still work; writes resume after.
    </MaintenanceMode>
  </div>
);
