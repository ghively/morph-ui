import './ShortcutHelp.css';

export interface Shortcut {
  keys: string[];
  action: string;
}

export interface ShortcutHelpProps {
  groups: { title: string; shortcuts: Shortcut[] }[];
  className?: string;
}

/** Keyboard-shortcut reference: kbd chips + action list, grouped. */
export function ShortcutHelp({ groups, className = '' }: ShortcutHelpProps) {
  return (
    <div className={className} data-shortcuts="">
      {groups.map((g) => (
        <div key={g.title} data-shortcutgroup="">
          <h3 data-shortcuttitle="">{g.title}</h3>
          <ul data-shortcutlist="">
            {g.shortcuts.map((s) => (
              <li key={`${s.action}-${s.keys.join('+')}`} data-shortcutrow="">
                <span data-keys="">
                  {s.keys.map((k) => (
                    <kbd key={k}>{k}</kbd>
                  ))}
                </span>
                <span data-shortcutaction="">{s.action}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
