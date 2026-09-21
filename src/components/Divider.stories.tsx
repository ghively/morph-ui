import { Divider } from './Divider';

export default {
  title: 'Divider',
  component: Divider,
};

export const Plain = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <p style={{ margin: 0 }}>Q3 overview</p>
    <Divider />
    <p style={{ margin: 0 }}>Department breakdown</p>
  </div>
);

export const Labeled = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <p style={{ margin: 0 }}>Retrieved passages</p>
    <Divider label="3 sources below threshold" />
    <p style={{ margin: 0 }}>Filtered out</p>
  </div>
);
