import { useState } from 'react';
import { Popover, type PopoverPlacement } from './Popover';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { InitialsAvatar } from './InitialsAvatar';

export default {
  title: 'Popover',
  component: Popover,
};

const stage = { padding: '16px 24px 360px' } as const;

export const Default = () => {
  const [sources, setSources] = useState<Record<string, boolean>>({ docs: true, tickets: true, chat: false });
  const toggle = (k: string) => (v: boolean) => setSources(s => ({ ...s, [k]: v }));
  return (
    <div style={stage}>
      <Popover trigger="Filters · 2" title="Filter sources" defaultOpen>
        <Checkbox id="pop-docs" label="Documentation" checked={sources.docs} onChange={toggle('docs')} />
        <Checkbox id="pop-tickets" label="Support tickets" checked={sources.tickets} onChange={toggle('tickets')} />
        <Checkbox id="pop-chat" label="Chat transcripts" checked={sources.chat} onChange={toggle('chat')} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button size="sm" variant="ghost" onClick={() => setSources({ docs: false, tickets: false, chat: false })}>Clear</Button>
          <Button size="sm" variant="primary">Apply</Button>
        </div>
      </Popover>
    </div>
  );
};

export const ProfileCard = () => (
  <div style={stage}>
    <Popover
      label="Profile of Ada Lovelace"
      width={260}
      defaultOpen
      renderTrigger={p => (
        <button type="button" {...p} style={{ all: 'unset', cursor: 'pointer', borderRadius: 999 }}>
          <InitialsAvatar name="Ada Lovelace" label="Ada Lovelace" />
        </button>
      )}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <InitialsAvatar name="Ada Lovelace" size="lg" />
        <div>
          <div style={{ fontWeight: 650 }}>Ada Lovelace</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Analytical Engines · London</div>
        </div>
      </div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>Owns the retrieval eval suite. Usually replies within a day.</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="primary">Message</Button>
        <Button size="sm">View profile</Button>
      </div>
    </Popover>
  </div>
);

const PLACEMENTS: PopoverPlacement[] = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];

export const Placements = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '170px 240px', padding: '150px 40px' }}>
    {PLACEMENTS.map(p => (
      <Popover key={p} trigger={p} placement={p} width={200} label={p} defaultOpen closeOnInteractOutside={false}>
        <span>Anchored {p.replace('-', ' / ')}.</span>
      </Popover>
    ))}
  </div>
);
