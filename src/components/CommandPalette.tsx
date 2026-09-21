import { useState, useRef, useEffect, useMemo } from 'react';
import type { KeyboardEvent } from 'react';
import './CommandPalette.css';

export interface CommandPaletteCommand {
  id: string;
  label: string;
  shortcut?: string;
  group?: string;
  icon?: React.ReactNode;
  run: () => void;
}

export interface CommandPaletteProps {
  commands: CommandPaletteCommand[];
  open: boolean;
  controlled?: boolean; // if true, parent controls open state, else internal
  placeholder?: string;
  onSelect?: (commandId: string) => void;
  onRecentChange?: (recentIds: string[]) => void;
}

export function CommandPalette({
  commands,
  open: controlledOpen,
  controlled = true,
  placeholder = 'Search commands...',
  onSelect,
  onRecentChange,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlled ? controlledOpen : internalOpen;
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const filteredCommands = useMemo(() => {
    const q = query.toLowerCase();
    
    // Sort recently used first if query is empty
    let filtered = [...commands];
    if (q) {
        filtered = filtered.filter(cmd => cmd.label.toLowerCase().includes(q));
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
    
    for (const [name, cmds] of groupMap.entries()) {
        groups.push({ name, commands: cmds });
    }
    
    return groups;
  }, [filteredCommands, query, recentIds]);

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
      if (!controlled) {
          setInternalOpen(false);
      }
    }
  };

  const executeCommand = (cmd: CommandPaletteCommand) => {
      cmd.run();
      
      const newRecents = [cmd.id, ...recentIds.filter(id => id !== cmd.id)].slice(0, 5); // Keep top 5
      setRecentIds(newRecents);
      if (onRecentChange) {
          onRecentChange(newRecents);
      }

      if (onSelect) {
          onSelect(cmd.id);
      }
      
      if (!controlled) {
          setInternalOpen(false);
      }
  };

  if (!isOpen) return null;

  return (
    <div data-command-palette-overlay="" onClick={(e) => {
        if (e.target === e.currentTarget && !controlled) {
            setInternalOpen(false);
        }
    }}>
      <div data-command-palette-dialog="" role="dialog" aria-modal="true">
        <div data-command-palette-header="">
          <input
            ref={inputRef}
            data-command-palette-input=""
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="command-palette-listbox"
            aria-activedescendant={flatCommands[selectedIndex] ? `command-${flatCommands[selectedIndex].id}` : undefined}
          />
        </div>
        
        <div data-command-palette-listbox="" ref={listboxRef} role="listbox" id="command-palette-listbox">
          {flatCommands.length === 0 ? (
            <div data-command-palette-empty="">No commands found</div>
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
                                {cmd.icon && <span data-command-palette-icon="">{cmd.icon}</span>}
                                <span data-command-palette-label="">{cmd.label}</span>
                                {cmd.shortcut && <span data-command-palette-shortcut="">{cmd.shortcut}</span>}
                            </div>
                        )
                    })}
                </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
