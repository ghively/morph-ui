import { ToggleSwitch } from './ToggleSwitch';

export default {
  title: 'ToggleSwitch',
  component: ToggleSwitch,
};

export const Default = () => <ToggleSwitch on={false} onChange={() => {}} label="Demo Switch" />;
