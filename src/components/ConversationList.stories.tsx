import type { StoryDefault, Story } from '@ladle/react';
import { useState } from 'react';
import { ConversationList } from './ConversationList';

export default {
  component: ConversationList,
  title: 'ConversationList',
  parameters: {
    layout: 'padded',
  },

};


export const 
  () => {
    const [filter, setFilter] = useState('');
    const [activeId, setActiveId] = useState<string | null>('c2');
    
    return (
      <ConversationList
        filter={filter}
        onFilterChange={setFilter}
        activeId={activeId}
        onSelect={setActiveId}
        invites={[
          { id: 'i1', name: '#secret-project' }
        ]}
        groups={[
          {
            id: 'g1',
            label: 'Favorites',
            conversations: [
              { id: 'c1', name: 'Alice', unread: 2 },
              { id: 'c2', name: '#general', prefix: '# ' },
            ]
          },
          {
            id: 'g2',
            label: 'Rooms',
            collectionId: 'all-rooms',
            conversations: [
              { id: 'c3', name: '#design', prefix: '# ', encrypted: true },
              { id: 'c4', name: '#engineering', prefix: '# ', highlight: 5 },
            ]
          }
        ]}
      />
    );
  };

export const 
  () => {
    const [filter, setFilter] = useState('');
    return (
      <ConversationList
        filter={filter}
        onFilterChange={setFilter}
        groups={[{ id: 'g1', label: 'Rooms', conversations: [] }]}
      />
    );
  };

export const 
  () => {
    const [filter, setFilter] = useState('');
    return (
      <ConversationList
        filter={filter}
        onFilterChange={setFilter}
        fade={true}
        groups={[
          {
            id: 'g1',
            label: 'Rooms',
            conversations: [
              { id: 'c1', name: '#general', prefix: '# ' },
            ]
          }
        ]}
      />
    );
  };

export default {
  title: 'ConversationList',
} satisfies StoryDefault;
