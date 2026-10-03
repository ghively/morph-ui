import { CollapsibleSection, StatusRowList } from '@ghively/morph-ui';

export const Open = () => (
  <div style={{ maxWidth: 560 }}>
    <CollapsibleSection title="Moderation" meta="2 users" defaultOpen>
      <StatusRowList
        rows={[
          { id: '1', title: 'Riley Chen', meta: '@riley:example.com', actions: [{ id: 'b', label: 'Ban', tone: 'danger', onSelect: () => {} }] },
          { id: '2', title: 'Sam Ortiz', meta: '@sam:example.com', actions: [{ id: 'u', label: 'Unban', onSelect: () => {} }] },
        ]}
      />
    </CollapsibleSection>
  </div>
);

export const Collapsed = () => (
  <div style={{ maxWidth: 560 }}>
    <CollapsibleSection title="Archived rooms" meta="14 rooms">
      <p>Hidden until expanded.</p>
    </CollapsibleSection>
  </div>
);
