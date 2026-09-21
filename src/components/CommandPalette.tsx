import { useState, useRef, useEffect, useMemo } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import './CommandPalette.css';

export interface CommandPaletteCommand {
  id: string;
  label: string;
  shortcut?: string;
  group?: string;
  icon?: ReactNode;
  run: () => void;
  /** NEW: right-aligned secondary text (the app's `[data-palhint]`). */
  hint?: string;
  /** NEW: also matched against by the query filter. */
  keywords?: string;
}

export interface CommandPaletteProps {
  commands: CommandPaletteCommand[];
  open: boolean;
  controlled?: boolean; // if true, parent controls open state, else internal
  placeholder?: string;
  onSelect?: (commandId: string) => void;
  onRecentChange?: (recentIds: string[]) => void;
  /** NEW: query is controlled when supplied. */
  query?: string;
  onQueryChange?: (q: string) => void;
  /** NEW: initial query for the uncontrolled case (the app opens with a seed string). */
  initialQuery?: string;
  /** NEW: explicit group order; groups not listed keep insertion order after these. */
  groupOrder?: string[];
  /** NEW: per-group or global status line rendered under the list. */
  status?: ReactNode;
  /** NEW: empty-state override. */
  emptyTitle?: string;               // default 'No commands found'
  emptyHint?: ReactNode;
  /** NEW: close request (Escape / selection), for controlled hosts. */
  onRequestClose?: () => void;
  /** NEW: recents seed + cap. */
  recentIds?: string[];
  maxRecents?: number;               // default 5 (existing hard-coded value)
}

export function CommandPalette({
  commands,
  open: controlledOpen,
  controlled = true,
  placeholder = 'Search commands...',
  onSelect,
  onRecentChange,
  query: controlledQuery,
  onQueryChange,
  initialQuery = '',
  groupOrder = [],
  status,
  emptyTitle = 'No commands found',
  emptyHint,
  onRequestClose,
  recentIds: initialRecentIds,
  maxRecents = 5,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(controlledOpen === true ? true : false);
  const isOpen = controlled ? controlledOpen : internalOpen;
  
  const [internalQuery, setInternalQuery] = useState(initialQuery);
  const query = controlledQuery !== undefined ? controlledQuery : internalQuery;
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentIdsState, setRecentIdsState] = useState<string[]>(initialRecentIds || []);
  const recentIds = initialRecentIds !== undefined ? initialRecentIds : recentIdsState;
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (onRequestClose) onRequestClose();
    if (!controlled) setInternalOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (controlledQuery === undefined) {
        setInternalQuery(initialQuery);
      }
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen, initialQuery, controlledQuery]);

  const filteredCommands = useMemo(() => {
    const q = query.toLowerCase();
    
    let filtered = [...commands];
    if (q) {
        filtered = filtered.filter(cmd => 
          cmd.label.toLowerCase().includes(q) || 
          (cmd.hint && cmd.hint.toLowerCase().includes(q)) ||
          (cmd.keywords && cmd.keywords.toLowerCase().includes(q))
        );
    }

    if (!q) {
        filtered.sort((a, b) => {
            const indexA = recentIds.indexOf(a.id);
            const indexB = recentIds.indexOf(b.id);
            
            if (indexA !== -1 && indexB !== -1) return indexA - indexB; // both recent, preserve recent order
            if (indexA !== -1) return -1; // a is recent, b is not
            if (indexB !== -1) return 1; // b is recent, a is not
            return 0; // neither recent
        });
    }

    return filtered;
  }, [commands, query, recentIds]);

  const groupedCommands = useMemo(() => {
    const groups: { name: string; commands: CommandPaletteCommand[] }[] = [];
    const groupMap = new Map<string, CommandPaletteCommand[]>();
    
    // If no query, we want a 'Recently Used' group if we have recents
    const hasRecents = !query && recentIds.length > 0;
    
    if (hasRecents) {
        const recentCommands = filteredCommands.filter(c => recentIds.includes(c.id));
        if (recentCommands.length > 0) {
           groups.push({ name: 'Recently Used', commands: recentCommands });
        }
    }

    const restCommands = hasRecents ? filteredCommands.filter(c => !recentIds.includes(c.id)) : filteredCommands;

    for (const cmd of restCommands) {
        const groupName = cmd.group || 'Suggestions';
        if (!groupMap.has(groupName)) {
            groupMap.set(groupName, []);
        }
        groupMap.get(groupName)!.push(cmd);
    }
    
    // Order groups according to groupOrder
    const orderedGroupNames = [...groupMap.keys()].sort((a, b) => {
      const indexA = groupOrder.indexOf(a);
      const indexB = groupOrder.indexOf(b);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0; // maintain insertion order for unlisted groups
    });

    for (const name of orderedGroupNames) {
        groups.push({ name, commands: groupMap.get(name)! });
    }
    
    return groups;
  }, [filteredCommands, query, recentIds, groupOrder]);

  // Flatten for keyboard nav
  const flatCommands = useMemo(() => {
      return groupedCommands.flatMap(g => g.commands);
  }, [groupedCommands]);

  useEffect(() => {
      setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
      if (listboxRef.current && flatCommands.length > 0) {
          const activeItem = listboxRef.current.querySelector(`[data-command-index="${selectedIndex}"]`) as HTMLElement;
          if (activeItem) {
              // Basic scrollIntoView if out of bounds
              const listRect = listboxRef.current.getBoundingClientRect();
              const itemRect = activeItem.getBoundingClientRect();
              
              if (itemRect.top < listRect.top) {
                  listboxRef.current.scrollTop -= (listRect.top - itemRect.top);
              } else if (itemRect.bottom > listRect.bottom) {
                  listboxRef.current.scrollTop += (itemRect.bottom - listRect.bottom);
              }
          }
      }
  }, [selectedIndex, flatCommands]);


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < flatCommands.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatCommands[selectedIndex]) {
          executeCommand(flatCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (controlledQuery === undefined) {
      setInternalQuery(val);
    }
    if (onQueryChange) {
      onQueryChange(val);
    }
  };

  const executeCommand = (cmd: CommandPaletteCommand) => {
      cmd.run();
      
      const newRecents = [cmd.id, ...recentIds.filter(id => id !== cmd.id)].slice(0, maxRecents);
      
      if (initialRecentIds === undefined) {
        setRecentIdsState(newRecents);
      }
      
      if (onRecentChange) {
          onRecentChange(newRecents);
      }

      if (onSelect) {
          onSelect(cmd.id);
      }
      
      handleClose();
  };

  if (!isOpen) return null;

  return (
    <div data-command-palette-overlay="" onClick={(e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }}>
      <div data-command-palette-dialog="" role="dialog" aria-modal="true">
        <div data-command-palette-header="">
          <input
            ref={inputRef}
            data-command-palette-input=""
            placeholder={placeholder}
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="command-palette-listbox"
            aria-activedescendant={flatCommands[selectedIndex] ? `command-${flatCommands[selectedIndex].id}` : undefined}
          />
        </div>
        
        <div data-command-palette-listbox="" ref={listboxRef} role="listbox" id="command-palette-listbox">
          {flatCommands.length === 0 ? (
            <div data-command-palette-empty="">
              <div style={{ fontWeight: 600 }}>{emptyTitle}</div>
              {emptyHint && <div style={{ color: 'var(--app-faint)', marginTop: 'var(--s1)' }}>{emptyHint}</div>}
            </div>
          ) : (
            groupedCommands.map(group => (
                <div key={group.name} data-command-palette-group="">
                    <div data-command-palette-group-header="">{group.name}</div>
                    {group.commands.map(cmd => {
                        const index = flatCommands.indexOf(cmd);
                        const isActive = index === selectedIndex;
                        return (
                            <div
                                key={cmd.id}
                                id={`command-${cmd.id}`}
                                data-command-palette-item=""
                                data-active={isActive ? "true" : undefined}
                                data-command-index={index}
                                role="option"
                                aria-selected={isActive}
                                onClick={() => executeCommand(cmd)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: 'var(--s2)' }}>
                                  {cmd.icon && <span data-command-palette-icon="">{cmd.icon}</span>}
                                  <span data-command-palette-label="" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cmd.label}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', flex: 'none' }}>
                                  {cmd.hint && <span data-command-palette-hint="">{cmd.hint}</span>}
                                  {cmd.shortcut && <span data-command-palette-shortcut="">{cmd.shortcut}</span>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ))
          )}
        </div>
        
        {status && (
          <div data-command-palette-status="" role="status">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
