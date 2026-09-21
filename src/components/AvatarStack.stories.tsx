import { AvatarStack } from './AvatarStack';

export default {
  title: 'AvatarStack',
  component: AvatarStack,
};

export const Default = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <AvatarStack
      people={[
        { name: 'Priya Nair' },
        { name: 'Tom Becker' },
        { name: 'Atlas Agent', agent: true },
        { name: 'June Park' },
        { name: 'Sam Okafor' },
        { name: 'Lee Wong' },
      ]}
    />
    <AvatarStack size="sm" max={3} people={[{ name: 'Priya Nair' }, { name: 'Tom Becker' }, { name: 'June Park' }]} />
  </div>
);
