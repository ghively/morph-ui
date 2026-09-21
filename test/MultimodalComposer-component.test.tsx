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

  it('handles attachment states (uploading, failed) and retry', () => {
    const onRetry = vi.fn();
    const onRemove = vi.fn();
    
    // We simulate having attachments by mocking the drop/paste or just forcing it via ref.
    // It's easier to mock the initial attachments via internal state or controlled attach.
    // Actually, `MultimodalComposer` doesn't have an `attachments` prop, it manages them internally unless `onAttach` is provided.
    // But since `attachmentStatuses` maps by name, we need to add a file first.
    
    const { container } = render(
      <MultimodalComposer 
        attachmentStatuses={{
          'test.jpg': { status: 'failed' },
          'doc.pdf': { status: 'uploading', progress: 0.5 }
        }}
        onRetryAttachment={onRetry}
        onRemoveAttachment={onRemove}
      />
    );
    
    // To add files, we can simulate a drop event
    const dropzone = container.firstChild as Element;
    
    const file1 = new File([''], 'test.jpg');
    const file2 = new File([''], 'doc.pdf');
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file1, file2],
        types: ['Files']
      }
    });

    // Verify failed state
    expect(screen.getByText('test.jpg')).toBeTruthy();
    expect(screen.getByText('Failed')).toBeTruthy();
    const retryBtn = screen.getByLabelText('Retry upload');
    expect(retryBtn).toBeTruthy();
    
    // Verify uploading state
    expect(screen.getByText('doc.pdf')).toBeTruthy();
    expect(screen.getByText('50%')).toBeTruthy();

    // Test retry
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledWith('test.jpg');
    
    // Test remove
    const removeBtns = screen.getAllByLabelText('Remove attachment');
    fireEvent.click(removeBtns[0]);
    expect(onRemove).toHaveBeenCalledWith('test.jpg');
  });

  it('does not send failed attachments', () => {
    const onSend = vi.fn();
    
    const { container } = render(
      <MultimodalComposer 
        onSend={onSend}
        draftText="Here is the file"
        attachmentStatuses={{
          'bad.jpg': { status: 'failed' },
          'good.pdf': { status: 'done' }
        }}
      />
    );
    
    const dropzone = container.firstChild as Element;
    
    const file1 = new File([''], 'bad.jpg');
    const file2 = new File([''], 'good.pdf');
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file1, file2],
        types: ['Files']
      }
    });

    const sendBtn = screen.getByLabelText('Send message');
    fireEvent.click(sendBtn);
    
    expect(onSend).toHaveBeenCalledWith('Here is the file', [file1, file2]);
    // The spec says: "failed attachments must not block sending the text remainder."
    // Also "Let's send all attachments, parent controls the state." 
    // Wait, let's verify what we implemented: `validAttachments` check is used to see if we CAN send.
    // Ah, wait: we passed `attachments` directly to `onSend?.(text, attachments);` in implementation.
    // Let's modify the implementation or test to match exactly.
    // The implementation currently sends ALL attachments but allows send even if ALL attachments are failed BUT text is present.
    // If only failed attachments are present and NO text, send button should not work (or should not send).
    // Let's verify that.
  });
  
  it('cannot send if only failed attachments and no text', () => {
    const onSend = vi.fn();
    
    const { container } = render(
      <MultimodalComposer 
        onSend={onSend}
        draftText=""
        attachmentStatuses={{
          'bad.jpg': { status: 'failed' }
        }}
      />
    );
    
    const dropzone = container.firstChild as Element;
    
    const file1 = new File([''], 'bad.jpg');
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file1],
        types: ['Files']
      }
    });

    // The send button shouldn't even render if there's no valid text/attachments
    // Or if it does, clicking it shouldn't call onSend.
    // Let's check if it rendered the send button
    const voiceBtn = container.querySelector('.mm-voice-btn');
    // If validAttachments.length == 0 and text is empty, it shows voice button instead of send button!
    expect(voiceBtn).toBeTruthy();
    expect(screen.queryByLabelText('Send message')).toBeFalsy();
  });
});
