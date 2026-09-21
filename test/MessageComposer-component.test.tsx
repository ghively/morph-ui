import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MessageComposer, type ComposerDraft } from '../src/components/MessageComposer';
import { createRef } from 'react';

describe('MessageComposer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const defaultDraft: ComposerDraft = { text: '', mentions: [] };

  it('sendOnEnter true: Enter sends, Shift+Enter does not', () => {
    const onSend = vi.fn();
    const { getByRole } = render(
      <MessageComposer
        draft={{ text: 'hello', mentions: [] }}
        onDraftChange={() => {}}
        onSend={onSend}
        placeholder="Type..."
        sendOnEnter={true}
      />
    );
    const textarea = getByRole('combobox');

    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();

    // construct the event with { key:'Enter', isComposing: true }
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    Object.defineProperty(event, 'isComposing', { value: true });
    fireEvent(textarea, event);
    expect(onSend).not.toHaveBeenCalled();

    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('sendOnEnter false: Enter does not send, Cmd/Ctrl+Enter does', () => {
    const onSend = vi.fn();
    const { getByRole } = render(
      <MessageComposer
        draft={{ text: 'hello', mentions: [] }}
        onDraftChange={() => {}}
        onSend={onSend}
        placeholder="Type..."
        sendOnEnter={false}
      />
    );
    const textarea = getByRole('combobox');

    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();

    fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });
    expect(onSend).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    expect(onSend).toHaveBeenCalledTimes(2);
  });

  it('ArrowUp on empty draft calls onEditLast', () => {
    const onEditLast = vi.fn();
    const { getByRole, rerender } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        onEditLast={onEditLast}
      />
    );
    const textarea = getByRole('combobox');

    fireEvent.keyDown(textarea, { key: 'ArrowUp' });
    expect(onEditLast).toHaveBeenCalledTimes(1);

    rerender(
      <MessageComposer
        draft={{ text: 'hello', mentions: [] }}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        onEditLast={onEditLast}
      />
    );
    fireEvent.keyDown(textarea, { key: 'ArrowUp' });
    expect(onEditLast).toHaveBeenCalledTimes(1); // Not called again
  });

  it('Escape cancels reply/edit context', () => {
    const onCancel = vi.fn();
    const { getByRole } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        context={{ mode: 'edit', preview: 'hi', onCancel }}
      />
    );
    const textarea = getByRole('combobox');

    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('Reply context renders chip and preview', () => {
    const { getByText, getByLabelText } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        context={{ mode: 'reply', senderName: 'Alice', preview: 'hello world', onCancel: () => {} }}
      />
    );
    expect(getByText('Replying to Alice')).toBeTruthy();
    expect(getByText('hello world')).toBeTruthy();
    expect(getByLabelText('Cancel reply')).toBeTruthy();
  });

  it('Edit context renders chip and preview', () => {
    const { getByText, getByLabelText } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        context={{ mode: 'edit', preview: 'my typo', onCancel: () => {} }}
      />
    );
    expect(getByText('Editing')).toBeTruthy();
    expect(getByText('my typo')).toBeTruthy();
    expect(getByLabelText('Cancel edit')).toBeTruthy();
  });

  it('offline banner renders when offline', () => {
    const { container, rerender } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        offline={true}
      />
    );
    const alert = container.querySelector('[data-alert][data-tone="danger"]');
    expect(alert).toBeTruthy();

    rerender(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        offline={false}
      />
    );
    expect(container.querySelector('[data-alert]')).toBeNull();
  });

  it('renders uploads', () => {
    const { container, rerender } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        uploads={[{ name: 'a.png', pct: 40 }]}
      />
    );
    const chip = container.querySelector('[role="status"]');
    expect(chip?.textContent).toContain('a.png');
    expect(chip?.textContent).toContain('40%');

    rerender(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        uploads={[]}
      />
    );
    expect(container.querySelector('[data-morph]')).toBeNull();
  });

  it('drop event triggers onAttach', () => {
    const onAttach = vi.fn();
    const { container } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        onAttach={onAttach}
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    
    fireEvent.dragOver(wrapper);
    const composer = container.querySelector('[data-composer]');
    expect(composer?.getAttribute('data-over')).toBe('true');

    const file = new File([''], 'a.png', { type: 'image/png' });
    Object.defineProperty(file, 'length', { value: 1 });
    const dt = { files: [file] };
    fireEvent.drop(wrapper, { dataTransfer: dt });
    
    expect(composer?.getAttribute('data-over')).toBe('false');
    expect(onAttach).toHaveBeenCalledWith([file]);
  });

  it('data-ready is true when text or context exists', () => {
    const { container, rerender } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
      />
    );
    expect(container.querySelector('[data-ready="false"]')).toBeTruthy();

    rerender(
      <MessageComposer
        draft={{ text: 'a', mentions: [] }}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
      />
    );
    expect(container.querySelector('[data-ready="true"]')).toBeTruthy();

    rerender(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        context={{ mode: 'edit', preview: 'x', onCancel: () => {} }}
      />
    );
    expect(container.querySelector('[data-ready="true"]')).toBeTruthy();
  });

  it('typing throttle works properly', () => {
    const onTyping = vi.fn();
    const onDraftChange = vi.fn();
    const { getByRole } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={onDraftChange}
        onSend={() => {}}
        placeholder="Type..."
        onTyping={onTyping}
        typingThrottleMs={3000}
      />
    );
    const textarea = getByRole('combobox');

    // First change triggers typing
    fireEvent.change(textarea, { target: { value: 'a' } });
    expect(onTyping).toHaveBeenCalledWith(true);
    onTyping.mockClear();

    // Second change within 3s doesn't trigger typing
    act(() => {
        vi.advanceTimersByTime(1000);
    });
    fireEvent.change(textarea, { target: { value: 'ab' } });
    expect(onTyping).not.toHaveBeenCalled();

    // Change after 3s triggers typing again
    act(() => {
        vi.advanceTimersByTime(2500);
    });
    fireEvent.change(textarea, { target: { value: 'abc' } });
    expect(onTyping).toHaveBeenCalledWith(true);

    // Send calls onTyping(false)
    const onSend = vi.fn();
    const { getAllByRole: getAllByRoleSend } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={onSend}
        placeholder="Type..."
        onTyping={onTyping}
      />
    );
    fireEvent.keyDown(getAllByRoleSend('combobox')[0], { key: 'Enter' });
    expect(onTyping).toHaveBeenCalledWith(false);
  });

  it('disabled makes textarea disabled and passes reason as placeholder', () => {
    const { getByRole, rerender } = render(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Normal placeholder"
        disabled={false}
      />
    );
    const textarea = getByRole('combobox') as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(false);
    expect(textarea.placeholder).toBe('Normal placeholder');

    rerender(
      <MessageComposer
        draft={defaultDraft}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="You don't have permission"
        disabled={true}
      />
    );
    expect(textarea.disabled).toBe(true);
    expect(textarea.placeholder).toBe("You don't have permission");
  });

  it('autosize updates style.height', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <MessageComposer
        draft={{ text: 'some long text\nwith newlines\n', mentions: [] }}
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Type..."
        textareaRef={ref}
      />
    );
    
    // In jsdom scrollHeight is 0, but style.height should be set to something
    expect(ref.current?.style.height).not.toBe('');
  });
});
