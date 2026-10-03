import { useState } from 'react';
import { ModalSurface } from '../../src/components/ModalSurface';
import { Button } from '../../src/components/Button';

// ModalSurface's scrim is position: fixed. The transformed host becomes its containing
// block so the open surface renders inside the preview cell instead of the viewport.
const Stage = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative', height: 420, transform: 'translateZ(0)', overflow: 'hidden', borderRadius: 12 }}>
    {children}
  </div>
);

const Body = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--app-text)', fontSize: 14, lineHeight: 1.5 }}>
    {children}
  </div>
);

export const BottomSheet = () => {
  const [open, setOpen] = useState(true);
  return (
    <Stage>
      {!open && <Button onClick={() => setOpen(true)}>Open sheet</Button>}
      {open && (
        <ModalSurface label="Share conversation" title="Share conversation" height="auto" onClose={() => setOpen(false)}>
          <Body>
            <p style={{ margin: 0 }}>Anyone in <strong>Support Ops</strong> with the link can read this thread and its artifacts.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Copy link</Button>
            </div>
          </Body>
        </ModalSurface>
      )}
    </Stage>
  );
};

export const CenterDialog = () => {
  const [open, setOpen] = useState(true);
  return (
    <Stage>
      {!open && <Button onClick={() => setOpen(true)}>Open dialog</Button>}
      {open && (
        <ModalSurface label="Rename workspace" title="Rename workspace" placement="center" width={420} height="auto" onClose={() => setOpen(false)}>
          <Body>
            <p style={{ margin: 0 }}>The new name is shown to all 12 members and in invite links.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Save</Button>
            </div>
          </Body>
        </ModalSurface>
      )}
    </Stage>
  );
};

export const TopDrawer = () => {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('threads');
  return (
    <Stage>
      {!open && <Button onClick={() => setOpen(true)}>Open drawer</Button>}
      {open && (
        <ModalSurface
          label="Workspace panels"
          placement="top-drawer"
          height="auto"
          tabs={[
            { id: 'threads', label: 'Threads' },
            { id: 'files', label: 'Files' },
            { id: 'pins', label: 'Pinned' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setOpen(false)}
        >
          <Body>
            {activeTab === 'threads' && <p style={{ margin: 0 }}>3 active threads · Q3 summary run, Finance sign-off, Onboarding docs</p>}
            {activeTab === 'files' && <p style={{ margin: 0 }}>12 files shared this week</p>}
            {activeTab === 'pins' && <p style={{ margin: 0 }}>2 pinned messages</p>}
          </Body>
        </ModalSurface>
      )}
    </Stage>
  );
};
