import { InitialsAvatar } from '../../src/components/InitialsAvatar';

export const Default = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <InitialsAvatar name="Alice Moreno" size="sm" />
      <InitialsAvatar name="Ben Okafor" />
      <InitialsAvatar name="Chiara Lindqvist" size="lg" />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <InitialsAvatar name="Support Bot" agent size="sm" />
      <InitialsAvatar name="Research Agent" agent />
      <InitialsAvatar name="Planner Agent" agent working size="lg" />
    </div>
  </div>
);
