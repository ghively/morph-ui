import type { StoryDefault, Story } from "@ladle/react";
import { SasVerificationPanel } from './SasVerificationPanel';

export default {
  title: 'Features/SasVerificationPanel',
} satisfies StoryDefault;

export const Default: Story = () => (
  <SasVerificationPanel
    phase="idle"
    onStart={() => {}}
  />
);

export const Emoji: Story = () => (
  <SasVerificationPanel
    phase="started"
    emoji={[
      { symbol: '🐶', name: 'Dog' },
      { symbol: '🐱', name: 'Cat' },
      { symbol: '🐭', name: 'Mouse' },
      { symbol: '🐹', name: 'Hamster' },
      { symbol: '🐰', name: 'Rabbit' },
      { symbol: '🦊', name: 'Fox' },
      { symbol: '🐻', name: 'Bear' }
    ]}
    onStart={() => {}}
  />
);
