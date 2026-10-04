import { useState } from 'react';
import { Button } from '../../src/components/Button';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const Loading = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
    <Button variant="primary" loading>
      Saving
    </Button>
    <Button variant="secondary" loading>
      Publishing
    </Button>
    <Button
      variant="primary"
      loading={loading}
      onClick={() => {
        setLoading(true);
        window.setTimeout(() => setLoading(false), 1500);
      }}
    >
      {loading ? 'Saving' : 'Save changes'}
    </Button>
    </div>
  );
};

export const Disabled = () => <Button disabled>Unavailable</Button>;
