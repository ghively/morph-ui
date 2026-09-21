import type { StoryDefault, Story } from '@ladle/react';
import { AlertBanner } from './AlertBanner';

export default {
  title: 'AlertBanner',
} satisfies StoryDefault;

export const AllVariations: Story = () => (
  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <AlertBanner 
      lead="Connection restoring." 
      live 
      action={<button>Cancel</button>}
    >
      Reconnecting to server...
    </AlertBanner>

    <AlertBanner 
      tone="warn"
      lead="Rate limit exceeded." 
      meta="12:05 PM"
    >
      Please wait before sending more messages.
    </AlertBanner>

    <AlertBanner 
      tone="danger"
      lead="Delivery failed." 
      dot={false}
      action={<button>Retry</button>}
    >
      Could not connect to the remote host.
    </AlertBanner>

    <AlertBanner 
      role="note"
      meta="10:00 AM"
    >
      System note: Encryption keys rotated.
    </AlertBanner>
  </div>
);
