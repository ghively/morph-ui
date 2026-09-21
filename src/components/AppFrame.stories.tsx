import type { StoryDefault, Story } from '@ladle/react';
import { AppFrame } from './AppFrame';

export default {
  title: 'Layout/AppFrame',
} satisfies StoryDefault;

export const Default: Story = () => (
  <AppFrame theme="dark" accent="blue">
    <div style={{ padding: 20 }}>App Content</div>
  </AppFrame>
);

export const Bare: Story = () => (
  <AppFrame bare>
    <div style={{ padding: 20 }}>Bare Content</div>
  </AppFrame>
);
