import { GroundingBadge } from './GroundingBadge';

export default {
  title: 'GroundingBadge',
  component: GroundingBadge,
};

export const Verdicts = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <GroundingBadge verdict="grounded" detail="5 of 5 claims cited" />
    <GroundingBadge verdict="partial" detail="3 of 5 claims cited" />
    <GroundingBadge verdict="ungrounded" />
  </div>
);
