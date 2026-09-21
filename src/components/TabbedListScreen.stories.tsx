import type { StoryDefault, Story } from '@ladle/react';
import { useState } from 'react';
import { TabbedListScreen } from './TabbedListScreen';

export default {
  title: 'TabbedListScreen',
} satisfies StoryDefault;

export const Default: Story = () => {
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
        <div style={{ padding: '20px' }}>
          <h3>Content for {activeTab}</h3>
          <p>This is the tab panel content.</p>
        </div>
      </TabbedListScreen>
    </div>
  );
};

export const WithSearchAndToolbar: Story = () => {
  const [activeTab, setActiveTab] = useState('t1');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ height: '400px', border: '1px solid var(--app-line)' }}>
      <TabbedListScreen
        tabs={[
          { id: 't1', label: 'Active' },
          { id: 't2', label: 'Inactive' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tablistLabel="Status Views"
        accent="blue"
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Search...',
          ariaLabel: 'Search items'
        }}
        toolbarEnd={
          <button style={{ padding: '4px 8px' }}>New Item</button>
        }
      >
        <div style={{ padding: '20px' }}>
          <h3>Search Query: {searchQuery || 'None'}</h3>
          <p>Tab content goes here.</p>
        </div>
      </TabbedListScreen>
    </div>
  );
};
