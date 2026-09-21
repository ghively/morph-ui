import type { StoryDefault, Story } from "@ladle/react";
import { CredentialSignInForm } from './CredentialSignInForm';
import { useState } from 'react';

export default {
  title: 'Features/CredentialSignInForm',
} satisfies StoryDefault;

export const Default: Story = () => {
    const [server, setServer] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
      <CredentialSignInForm
        title="Sign in"
        description="Your gateway"
        server={server}
        onServerChange={setServer}
        username={username}
        onUsernameChange={setUsername}
        password={password}
        onPasswordChange={setPassword}
        onSubmit={() => {}}
      />
    );
};
