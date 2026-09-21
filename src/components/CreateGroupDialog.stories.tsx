import type { StoryDefault, Story } from "@ladle/react";
import { CreateGroupDialog } from './CreateGroupDialog';
import { useState } from 'react';

export default {
  title: 'Features/CreateGroupDialog',
} satisfies StoryDefault;

export const Default: Story = () => {
    const [values, setValues] = useState({
      name: '',
      description: '',
      isCollection: false,
      isPublic: false,
      encrypted: false,
      collectionId: '',
      invites: ''
    });
    return (
      <CreateGroupDialog
        values={values}
        onChange={setValues}
        onSubmit={console.log}
        onClose={() => {}}
        collections={[{ id: '1', name: 'Work' }]}
      />
    );
};
