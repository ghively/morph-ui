import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CommandPalette } from '../src/components/CommandPalette';

describe('CommandPalette', () => {
  const commands = [
    { id: '1', label: 'Toggle dark mode', run: vi.fn(), group: 'Settings' },
    { id: '2', label: 'New document', run: vi.fn(), shortcut: '⌘N' },
    { id: '3', label: 'Save', run: vi.fn(), shortcut: '⌘S' },
    { id: '4', label: 'Close', run: vi.fn() },
    { id: '5', label: 'Print', run: vi.fn() },
    { id: '6', label: 'Settings', run: vi.fn() },
    { id: '7', label: 'Log out', run: vi.fn() },
  ];

  it('renders nothing when closed', () => {
    const { container } = render(<CommandPalette commands={commands} open={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders input and listbox when open', () => {
    render(<CommandPalette commands={commands} open={true} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search commands...')).toBeTruthy();
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('filters commands based on input', () => {
    render(<CommandPalette commands={commands} open={true} controlled={false} />);
    const input = screen.getByPlaceholderText('Search commands...');
    
    fireEvent.change(input, { target: { value: 'dark' } });
    
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Toggle dark mode');
  });

  it('groups commands correctly', () => {
    render(<CommandPalette commands={commands} open={true} />);
    
    // Verify grouping via headers
    const headers = document.querySelectorAll('[data-command-palette-group-header]');
    const headerTexts = Array.from(headers).map(h => h.textContent);
    
    expect(headerTexts).toContain('Settings');
    expect(headerTexts).toContain('Suggestions');
  });

  it('keyboard navigation works', () => {
    render(<CommandPalette commands={commands} open={true} />);
    const input = screen.getByPlaceholderText('Search commands...');
    
    // First item is active by default
    let options = screen.getAllByRole('option');
    expect(options[0].getAttribute('data-active')).toBe("true");
    
    // Arrow down
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(options[0].getAttribute('data-active')).toBeNull();
    expect(options[1].getAttribute('data-active')).toBe("true");
    
    // Arrow up
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(options[0].getAttribute('data-active')).toBe("true");
    expect(options[1].getAttribute('data-active')).toBeNull();
  });

  it('executes command on enter', () => {
    const runSpy = vi.fn();
    const testCommands = [{ id: '1', label: 'Test', run: runSpy }];
    
    render(<CommandPalette commands={testCommands} open={true} />);
    const input = screen.getByPlaceholderText('Search commands...');
    
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(runSpy).toHaveBeenCalled();
  });

  it('maintains recently used commands', () => {
    const onRecentChange = vi.fn();
    render(
      <CommandPalette 
        commands={commands} 
        open={true} 
        controlled={false}
        onRecentChange={onRecentChange} 
      />
    );
    
    const input = screen.getByPlaceholderText('Search commands...');
    
    // Select first command
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRecentChange).toHaveBeenCalledWith(['1']);
  });

  it('closes on escape when uncontrolled', () => {
    const { container } = render(<CommandPalette commands={commands} open={true} controlled={false} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    
    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(container.firstChild).toBeNull();
  });

  it('closes on overlay click when uncontrolled', () => {
    const { container } = render(<CommandPalette commands={commands} open={true} controlled={false} />);
    const overlay = document.querySelector('[data-command-palette-overlay]')!;
    
    fireEvent.click(overlay);
    expect(container.firstChild).toBeNull();
  });

  // NEW TESTS FROM WAVE 4

  it('hint renders and is matched by the filter', () => {
    const cmds = [
      { id: '1', label: 'Main', hint: 'find me', run: () => {} },
      { id: '2', label: 'Other', run: () => {} }
    ];
    render(<CommandPalette commands={cmds} open={true} />);
    
    // Hint renders
    const hint = document.querySelector('[data-command-palette-hint]');
    expect(hint?.textContent).toBe('find me');

    // Filter matches
    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.change(input, { target: { value: 'find' } });
    
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Main');
  });

  it('keywords matching works and is not displayed', () => {
    const cmds = [
      { id: '1', label: 'Main', keywords: 'hidden', run: () => {} }
    ];
    render(<CommandPalette commands={cmds} open={true} />);
    
    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.change(input, { target: { value: 'hid' } });
    
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Main');
    expect(options[0].textContent).not.toContain('hidden');
  });

  it('status node renders under the list, inside role="status"', () => {
    render(<CommandPalette commands={commands} open={true} status={<span>Loading...</span>} />);
    
    const status = screen.getByRole('status');
    expect(status).toBeTruthy();
    expect(status.textContent).toBe('Loading...');
  });

  it('emptyTitle/emptyHint override the default empty copy', () => {
    render(<CommandPalette commands={[]} open={true} emptyTitle="Custom Title" emptyHint="Custom Hint" />);
    
    expect(screen.getByText('Custom Title')).toBeTruthy();
    expect(screen.getByText('Custom Hint')).toBeTruthy();
  });

  it('controlled query works', () => {
    const onQueryChange = vi.fn();
    const { rerender } = render(<CommandPalette commands={commands} open={true} query="set" onQueryChange={onQueryChange} />);
    
    const input = screen.getByPlaceholderText('Search commands...') as HTMLInputElement;
    expect(input.value).toBe('set');
    
    fireEvent.change(input, { target: { value: 'settings' } });
    expect(onQueryChange).toHaveBeenCalledWith('settings');
    expect(input.value).toBe('set'); // Doesn't change until prop updates

    rerender(<CommandPalette commands={commands} open={true} query="settings" onQueryChange={onQueryChange} />);
    expect(input.value).toBe('settings');
  });

  it('initialQuery seeds the uncontrolled input on open', () => {
    render(<CommandPalette commands={commands} open={true} initialQuery="print" />);
    const input = screen.getByPlaceholderText('Search commands...') as HTMLInputElement;
    expect(input.value).toBe('print');
    
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(1);
  });

  it('groupOrder forces group ordering', () => {
    const cmds = [
      { id: '1', label: 'A', group: 'G2', run: () => {} },
      { id: '2', label: 'B', group: 'G1', run: () => {} },
      { id: '3', label: 'C', group: 'G3', run: () => {} }
    ];
    render(<CommandPalette commands={cmds} open={true} groupOrder={['G1', 'G2']} />);
    
    const headers = document.querySelectorAll('[data-command-palette-group-header]');
    const texts = Array.from(headers).map(h => h.textContent);
    
    expect(texts[0]).toBe('G1');
    expect(texts[1]).toBe('G2');
    expect(texts[2]).toBe('G3');
  });

  it('maxRecents caps the recent array', () => {
    let recentIds: string[] = [];
    const onRecentChange = (ids: string[]) => { recentIds = ids; };
    const { unmount } = render(
      <CommandPalette 
        commands={commands} 
        open={true} 
        controlled={false}
        onRecentChange={onRecentChange}
        maxRecents={2}
      />
    );
    
    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Simulate reopening
    unmount();
    const { unmount: unmount2 } = render(
      <CommandPalette 
        commands={commands} 
        open={true} 
        controlled={false}
        onRecentChange={onRecentChange}
        maxRecents={2}
        recentIds={recentIds}
      />
    );
    
    const input2 = screen.getByPlaceholderText('Search commands...');
    fireEvent.keyDown(input2, { key: 'ArrowDown' });
    fireEvent.keyDown(input2, { key: 'ArrowDown' });
    fireEvent.keyDown(input2, { key: 'Enter' });

    unmount2();
    render(
      <CommandPalette 
        commands={commands} 
        open={true} 
        controlled={false}
        onRecentChange={onRecentChange}
        maxRecents={2}
        recentIds={recentIds}
      />
    );

    const input3 = screen.getByPlaceholderText('Search commands...');
    fireEvent.keyDown(input3, { key: 'ArrowDown' });
    fireEvent.keyDown(input3, { key: 'ArrowDown' });
    fireEvent.keyDown(input3, { key: 'ArrowDown' });
    fireEvent.keyDown(input3, { key: 'Enter' });

    expect(recentIds.length).toBe(2);
  });

  it('recentIds seed sorts first with empty query', () => {
    render(<CommandPalette commands={commands} open={true} recentIds={['3', '1']} />);
    
    const headers = document.querySelectorAll('[data-command-palette-group-header]');
    expect(headers[0].textContent).toBe('Recently Used');

    const options = screen.getAllByRole('option');
    expect(options[0].textContent).toContain('Save'); // id: 3
    expect(options[1].textContent).toContain('Toggle dark mode'); // id: 1
  });
});
