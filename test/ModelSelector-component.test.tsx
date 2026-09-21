import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ModelSelector } from '../src/components/ModelSelector';

describe('ModelSelector', () => {
  afterEach(() => {
    cleanup(); // Add cleanup
  });

  const models = [
    { id: '1', label: 'GPT-4o', vendor: 'OpenAI', contextWindow: 128000, enabled: true },
    { id: '2', label: 'Claude 3.5 Sonnet', vendor: 'Anthropic', contextWindow: 200000, tags: ['fast'], enabled: true },
    { id: '3', label: 'Llama 3 70B', vendor: 'Meta', contextWindow: 8000, enabled: false },
  ];

  it('renders trigger with selected label or placeholder', () => {
    const { rerender } = render(<ModelSelector models={models} onSelect={() => {}} />);
    expect(screen.getByText('Select model')).toBeTruthy();

    rerender(<ModelSelector models={models} selectedId="2" onSelect={() => {}} />);
    expect(screen.getByText('Claude 3.5 Sonnet')).toBeTruthy();
  });

  it('opens popover on click and shows listbox', () => {
    render(<ModelSelector models={models} onSelect={() => {}} />);
    
    expect(screen.queryByRole('listbox')).toBeNull();
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(screen.getByText('GPT-4o')).toBeTruthy();
    expect(screen.getByText('Claude 3.5 Sonnet')).toBeTruthy();
    expect(screen.getByText('Llama 3 70B')).toBeTruthy();
    
    // Check disabled state
    const llama = document.querySelector('#model-3');
    expect(llama?.getAttribute('data-disabled')).toBe('true');
  });

  it('handles selection and keyboard navigation', () => {
    const onSelect = vi.fn();
    render(<ModelSelector models={models} onSelect={onSelect} />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    const listbox = screen.getByRole('listbox');
    
    // Arrow down
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    
    // Enter
    fireEvent.keyDown(listbox, { key: 'Enter' });
    
    expect(onSelect).toHaveBeenCalledWith('2');
  });

  it('shows search input only when models > 8', () => {
    const { unmount } = render(<ModelSelector models={models} onSelect={() => {}} />);
    
    let trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.queryByPlaceholderText('Search models...')).toBeNull();

    unmount(); // Unmount instead of rerender for this test
    
    // Create 9 models
    const manyModels = Array.from({ length: 9 }).map((_, i) => ({
      ...models[0],
      id: String(i),
      label: `Model ${i}`
    }));
    
    render(<ModelSelector models={manyModels} onSelect={() => {}} />);
    trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.getByPlaceholderText('Search models...')).toBeTruthy();
  });
});
