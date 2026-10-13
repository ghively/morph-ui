import type { StoryDefault, Story } from "@ladle/react";
import { CreateGroupDialog } from './CreateGroupDialog';
import { useState } from 'react';
import type { CreateGroupValues } from './CreateGroupDialog';

export default {
  title: 'Features/CreateGroupDialog',
} satisfies StoryDefault;

const initial: CreateGroupValues = {
  name: '',
  description: '',
  isCollection: false,
  isPublic: false,
  encrypted: true,
  collectionId: '',
  invites: ''
};

export const Default: Story = () => {
    const [values, setValues] = useState(initial);
    return (
      <CreateGroupDialog
        values={values}
        onChange={setValues}
        onSubmit={console.log}
        onClose={() => {}}
        collections={[{ id: '1', name: 'Work' }, { id: '2', name: 'Research' }]}
      />
    );
};

export const Collection: Story = () => {
    const [values, setValues] = useState({ ...initial, isCollection: true, name: 'Field notes' });
    return (
      <CreateGroupDialog
        values={values}
        onChange={setValues}
        onSubmit={console.log}
        onClose={() => {}}
      />
    );
};

export const WithInvitesAndError: Story = () => {
    const [values, setValues] = useState({ ...initial, name: 'agents', invites: '@agent_music:example.org' });
    return (
      <CreateGroupDialog
        values={values}
        onChange={setValues}
        onSubmit={console.log}
        onClose={() => {}}
        collections={[{ id: '1', name: 'Work' }]}
        error="@nope — not a valid address"
      />
    );
};
