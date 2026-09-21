import { LineChart } from './LineChart';

export default {
  title: 'LineChart',
  component: LineChart,
};

const VALUES = [12, 18, 15, 24, 22, 31, 29, 38, 44, 41, 52, 58];
const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const Default = () => (
  <LineChart values={VALUES} labels={LABELS} label="Indexed chunks per month (thousands)" formatValue={(v) => `${v}k`} />
);

export const NoDots = () => <LineChart values={VALUES} showDots={false} label="Indexed chunks per month" />;

export const SinglePoint = () => <LineChart values={[42]} label="Single reading" />;
