import { TypingIndicator } from '../../src/components/TypingIndicator';

export const Default = () => (
  <div style={{ padding: '20px' }}>
    <TypingIndicator
      participants={[
        { id: '1', name: 'Alice' },
      ]}
    />
  </div>
);
