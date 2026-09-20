import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MultimodalComposer } from '../src/components/MultimodalComposer';

describe('MultimodalComposer', () => {
  it('renders correctly', () => {
    render(<MultimodalComposer placeholder="Type here" />);
    expect(screen.getByRole('combobox')).toBeTruthy();
    expect(screen.getByPlaceholderText('Type here')).toBeTruthy();
  });

  it('handles draft change', () => {
    const onDraftChange = vi.fn();
    render(<MultimodalComposer onDraftChange={onDraftChange} />);
    
    const textarea = screen.getByRole('combobox');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    
    expect(onDraftChange).toHaveBeenCalledWith('Hello');
  });

  it('handles send with text and attachments', () => {
    const onSend = vi.fn();
    render(<MultimodalComposer onSend={onSend} draftText="Test message" />);
    
    const sendBtn = screen.getByLabelText('Send message');
    fireEvent.click(sendBtn);
    
    expect(onSend).toHaveBeenCalledWith('Test message', expect.any(Array));
  });

  it('handles keyboard send (Enter)', () => {
    const onSend = vi.fn();
    render(<MultimodalComposer onSend={onSend} draftText="Keyboard send" />);
    
    const textarea = screen.getByRole('combobox');
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });
    
    expect(onSend).toHaveBeenCalledWith('Keyboard send', expect.any(Array));
  });

  it('handles disabled state', () => {
    render(<MultimodalComposer disabled />);
    const textarea = screen.getByRole('combobox');
    expect((textarea as HTMLButtonElement).disabled).toBe(true);
    
    const attachBtn = screen.getByLabelText('Attach file');
    expect((attachBtn as HTMLButtonElement).disabled).toBe(true);
  });
});
