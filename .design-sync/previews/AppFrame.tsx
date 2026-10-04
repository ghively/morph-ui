import { AppFrame } from '../../src/components/AppFrame';
import { NavigationRail } from '../../src/components/NavigationRail';
import { PaneHeader } from '../../src/components/PaneHeader';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { GlyphIcon } from '../../src/components/GlyphIcon';
import { InitialsAvatar } from '../../src/components/InitialsAvatar';

const noop = () => {};

const railItems = [
  { id: 'chats', label: 'Chats', icon: <GlyphIcon name="chats" /> },
  { id: 'agents', label: 'Agents', icon: <GlyphIcon name="agents" /> },
  { id: 'dashboard', label: 'Dashboard', icon: <GlyphIcon name="dashboard" /> },
  { id: 'notes', label: 'Notes', icon: <GlyphIcon name="notes" /> },
];

function PaneBody() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 16px' }}>
      <Card title="Support backlog" subtitle="Updated 4m ago" actions={<Badge tone="warn">312 open</Badge>}>
        Unanswered tickets grew 8% week over week, driven by the billing queue.
      </Card>
      <Card title="Index health" subtitle="All departments" actions={<Badge tone="success">fresh</Badge>}>
        41 of 43 sources fresh. Two stale sources are scheduled for retry.
      </Card>
    </div>
  );
}

// Non-bare AppFrame is the full shell grid: children supply its zones. The
// NavigationRail fills the dock zone; the main pane uses the frame's
// `data-inner` / `data-pane` slots (the same markup `bare` renders for you).
export const Default = () => (
  <AppFrame theme="dark" accent="blue" style={{ height: 560 }}>
    <NavigationRail
      items={railItems}
      activeId="dashboard"
      onSelect={noop}
      account={{ name: 'Priya N.', secondary: 'Admin', avatar: <InitialsAvatar name="Priya N" />, onSelect: noop }}
    />
    <div data-inner="">
      <div data-pane="" role="main" data-sec="blue">
        <PaneHeader title="Operations" subtitle="Support · Q4" status={{ label: 'Live', tone: 'ok', phase: 'live' }} />
        <PaneBody />
      </div>
    </div>
  </AppFrame>
);

export const Bare = () => (
  <AppFrame bare style={{ height: 480 }}>
    <PaneHeader title="Operations" subtitle="Support · Q4" />
    <PaneBody />
  </AppFrame>
);
