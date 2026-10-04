import { AlertBanner } from '../../src/components/AlertBanner';
import { Button } from '../../src/components/Button';

export const AllVariations = () => (
  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <AlertBanner
      lead="Connection restoring."
      live
      action={<Button size="sm" variant="ghost">Cancel</Button>}
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
      action={<Button size="sm" variant="danger">Retry</Button>}
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
