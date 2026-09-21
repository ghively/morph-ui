import { SegmentedControl } from './SegmentedControl';

export default {
  title: 'SegmentedControl',
  component: SegmentedControl,
};

export const Default = () => (
  <SegmentedControl
    value="1"
    options={[{value: '1', label: 'One'}, {value: '2', label: 'Two'}]}
    onChange={() => {}}
    label="Demo Segmented Control"
  />
);
