import { useState } from 'react';
import { FollowUpChips } from './FollowUpChips';

export default {
  title: 'FollowUpChips',
  component: FollowUpChips,
};

export const Default = () => {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
      <FollowUpChips
        suggestions={[
          'Break this down by department',
          'Show the underlying tickets',
          'Compare with last quarter',
          'Draft the stakeholder summary',
        ]}
        onPick={setPicked}
      />
      {picked && <p style={{ margin: 0, fontSize: 13 }}>Asked: “{picked}”</p>}
    </div>
  );
};
