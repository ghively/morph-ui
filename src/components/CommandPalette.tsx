import './CommandPalette.css';
import { usePalette, type PaletteProps } from './agentOps.shared';

export function CommandPalette(props: PaletteProps) {
  const p = usePalette(props);
  const { placeholder = 'Search commands...', emptyTitle = 'No commands found', emptyHint, status, className = '' } = props;
  if (!p.isOpen) return null;
  return (
    <div className={'command-palette ' + className} data-command-palette-overlay="" onMouseDown={e => { if (e.target === e.currentTarget) p.close(); }} onClick={e => { if (e.target === e.currentTarget) p.close(); }}>
      <div className="command-palette-dlg" data-command-palette-dialog="" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="command-palette-head" data-command-palette-header="">
          <span className="command-palette-glyph" aria-hidden="true">›</span>
          <input ref={p.inputRef} data-command-palette-input="" placeholder={placeholder} value={p.query} onChange={e => p.setQuery(e.target.value)} onKeyDown={p.onKeyDown}
            role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls={p.listId} aria-activedescendant={p.activeId} />
          <kbd>esc</kbd>
        </div>
        <div className="command-palette-list" data-command-palette-listbox="" ref={p.listRef} role="listbox" id={p.listId}>
          {p.flat.length === 0 ? (
            <div className="command-palette-empty" data-command-palette-empty=""><b>{emptyTitle}</b>{emptyHint && <span>{emptyHint}</span>}</div>
          ) : p.groups.map(g => (
            <div key={g.name} role="group" aria-label={g.name} data-command-palette-group="">
              <div className="command-palette-gh" data-command-palette-group-header="">{g.name}</div>
              {g.commands.map(c => {
                const i = p.indexOf(c), on = i === p.sel;
                return (
                  <div key={c.id} id={p.optId(c)} role="option" aria-selected={on} className="command-palette-item" data-command-palette-item="" data-active={on ? 'true' : undefined} data-command-index={i}
                    onClick={() => p.execute(c)} onMouseMove={() => !on && p.setSel(i)}>
                    <span className="command-palette-ic" aria-hidden="true">{c.icon ?? (c.group || 'S').charAt(0)}</span>
                    <span className="command-palette-label" data-command-palette-label="">{p.highlight(c.label)}</span>
                    {c.hint && <span className="command-palette-hint" data-command-palette-hint="">{c.hint}</span>}
                    {c.shortcut && <kbd data-command-palette-shortcut="">{c.shortcut}</kbd>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="command-palette-foot" data-command-palette-status="" role="status">
          <span className="command-palette-st">{status ?? p.flat.length + ' results'}</span>
          <span><kbd>↑↓</kbd> move</span><span><kbd>↵</kbd> run</span>
        </div>
      </div>
    </div>
  );
}

export type { PaletteCommand as CommandPaletteCommand, PaletteProps as CommandPaletteProps } from './agentOps.shared';
