import type { StoryDefault, Story } from "@ladle/react";
import { SasVerificationPanel } from './SasVerificationPanel';

export default {
  title: 'Features/SasVerificationPanel',
} satisfies StoryDefault;

const emoji = [
  { symbol: '🐶', name: 'Dog' },
  { symbol: '🐱', name: 'Cat' },
  { symbol: '🐭', name: 'Mouse' },
  { symbol: '🐹', name: 'Hamster' },
  { symbol: '🐰', name: 'Rabbit' },
  { symbol: '🦊', name: 'Fox' },
  { symbol: '🐻', name: 'Bear' }
];

export const Default: Story = () => (
  <SasVerificationPanel
    phase="idle"
    onStart={() => {}}
  />
);

export const Emoji: Story = () => (
  <SasVerificationPanel
    phase="started"
    emoji={emoji}
    onStart={() => {}}
  />
);

export const IncomingRequest: Story = () => (
  <SasVerificationPanel
    phase="requested"
    initiatedByMe={false}
    onStart={() => {}}
    onAccept={() => {}}
    onCancel={() => {}}
  />
);

export const WaitingAndDone: Story = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 560 }}>
    <SasVerificationPanel
      phase="requested"
      initiatedByMe
      onStart={() => {}}
      onCancel={() => {}}
    />
    <SasVerificationPanel
      phase="done"
      emoji={emoji}
      onStart={() => {}}
      onConfirmMatch={() => {}}
    />
  </div>
);
