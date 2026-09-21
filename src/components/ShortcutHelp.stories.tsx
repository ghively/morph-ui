import { ShortcutHelp } from './ShortcutHelp';

export default {
  title: 'ShortcutHelp',
  component: ShortcutHelp,
};

export const Default = () => (
  <div style={{ maxWidth: 400 }}>
    <ShortcutHelp
      groups={[
        {
          title: 'Answer lab',
          shortcuts: [
            { keys: ['⌘', 'K'], action: 'Focus query box' },
            { keys: ['↵'], action: 'Ask' },
            { keys: ['Esc'], action: 'Stop streaming' },
          ],
        },
        {
          title: 'Dashboard',
          shortcuts: [
            { keys: ['1', '…', '3'], action: 'Switch tabs' },
            { keys: ['?'], action: 'Open this reference' },
          ],
        },
      ]}
    />
  </div>
);
