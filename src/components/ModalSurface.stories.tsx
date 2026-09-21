import type { StoryDefault, Story } from '@ladle/react';
import { useState } from 'react';
import { ModalSurface } from './ModalSurface';

export default {
  title: 'ModalSurface',
} satisfies StoryDefault;

export const BottomSheet: Story = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Bottom Sheet</button>
      {open && (
        <ModalSurface 
          label="Example Sheet" 
          title="Example Sheet"
          onClose={() => setOpen(false)}
        >
          <div style={{ padding: '20px' }}>Content goes here</div>
        </ModalSurface>
      )}
    </div>
  );
};

export const CenterDialog: Story = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Center Dialog</button>
      {open && (
        <ModalSurface 
          label="Example Dialog" 
          title="Example Dialog"
          placement="center"
          onClose={() => setOpen(false)}
        >
          <div style={{ padding: '20px' }}>Content goes here</div>
        </ModalSurface>
      )}
    </div>
  );
};

export const TopDrawer: Story = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('t1');
  
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Top Drawer</button>
      {open && (
        <ModalSurface 
          label="Example Drawer" 
          placement="top-drawer"
          tabs={[
            { id: 't1', label: 'Tab 1' },
            { id: 't2', label: 'Tab 2' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setOpen(false)}
        >
          <div style={{ padding: '20px' }}>Content for {activeTab}</div>
        </ModalSurface>
      )}
    </div>
  );
};
