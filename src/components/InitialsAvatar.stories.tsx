import { InitialsAvatar } from './InitialsAvatar';

export default {
  title: 'InitialsAvatar',
  component: InitialsAvatar,
};

export const Default = () => <InitialsAvatar name="Test User" />;

const row = { display: 'flex', alignItems: 'center', gap: 'var(--s3)', flexWrap: 'wrap' } as const;

/** Each person keeps one colour everywhere, keyed by name (or `colorKey`). */
export const Identities = () => (
  <div style={row}>
    {['Ada Lovelace', 'Grace Hopper', 'Priya Nair', 'Tom Becker', 'June Park', 'Sam Okafor', 'Émile Zola', '李 小龙'].map((n) => (
      <InitialsAvatar key={n} name={n} label={n} />
    ))}
  </div>
);

export const SizesAndKinds = () => (
  <div style={{ display: 'grid', gap: 'var(--s4)' }}>
    <div style={row}>
      <InitialsAvatar name="Ada Lovelace" size="sm" />
      <InitialsAvatar name="Ada Lovelace" />
      <InitialsAvatar name="Ada Lovelace" size="lg" />
    </div>
    <div style={row}>
      <InitialsAvatar name="Atlas Agent" agent size="sm" />
      <InitialsAvatar name="Atlas Agent" agent />
      <InitialsAvatar name="Atlas Agent" agent size="lg" />
    </div>
    <div style={row}>
      <InitialsAvatar name="Grace Hopper" working label="Grace Hopper (typing)" />
      <InitialsAvatar name="Atlas Agent" agent working label="Atlas Agent (working)" />
    </div>
  </div>
);
