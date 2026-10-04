import { useState } from 'react';
import { SegmentedControl } from '../../src/components/SegmentedControl';

export const Default = () => {
  const [range, setRange] = useState('week');
  return (
    <SegmentedControl
      value={range}
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'quarter', label: 'Quarter' },
      ]}
      onChange={setRange}
      label="Reporting range"
    />
  );
};
