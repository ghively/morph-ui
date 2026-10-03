import { GroundingBadge } from './GroundingBadge';

export default {
  title: 'GroundingBadge',
  component: GroundingBadge,
};

export const Verdicts = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <GroundingBadge verdict="grounded" cited={5} total={5} />
    <GroundingBadge verdict="partial" cited={3} total={5} />
    <GroundingBadge verdict="ungrounded" cited={0} total={4} />
    <GroundingBadge verdict="ungrounded" />
  </div>
);
