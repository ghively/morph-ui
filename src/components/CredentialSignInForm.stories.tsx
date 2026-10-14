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

export const ServerResolved: Story = () => {
    const [username, setUsername] = useState('gregory');
    const [password, setPassword] = useState('••••••••');
    return (
      <CredentialSignInForm
        title="Sign in"
        description="Your gateway"
        server="example.org"
        onServerChange={() => {}}
        probe="ok"
        resolvedServer="https://matrix.example.org"
        username={username}
        onUsernameChange={setUsername}
        password={password}
        onPasswordChange={setPassword}
        onSubmit={() => {}}
      />
    );
};

export const SsoOnly: Story = () => (
  <CredentialSignInForm
    title="Sign in"
    description="Your gateway"
    server="corp.example.org"
    onServerChange={() => {}}
    probe="ok"
    resolvedServer="https://corp.example.org"
    passwordEnabled={false}
    username=""
    onUsernameChange={() => {}}
    password=""
    onPasswordChange={() => {}}
    ssoProviders={[{ id: 'google', name: 'Google' }, { id: 'github', name: 'GitHub' }]}
    onSso={() => {}}
    onSubmit={() => {}}
  />
);

export const ErrorState: Story = () => (
  <CredentialSignInForm
    title="Sign in"
    description="Your gateway"
    server="example.org"
    onServerChange={() => {}}
    probe="ok"
    resolvedServer="https://matrix.example.org"
    username="gregory"
    onUsernameChange={() => {}}
    password="hunter2"
    onPasswordChange={() => {}}
    onSubmit={() => {}}
    error="Wrong password. 3 attempts left."
  />
);
