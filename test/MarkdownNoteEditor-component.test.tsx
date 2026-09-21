import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MarkdownNoteEditor } from '../src/components/MarkdownNoteEditor';

describe('MarkdownNoteEditor', () => {
  const defaultNotes = [
    { id: '1', title: 'First Note' },
    { id: '2', title: '' },
  ];

  it('renders one role="option" per note and handles activeId', () => {
    const { getAllByRole } = render(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId="1"
        onSelect={() => {}}
        draft={null}
        onDraftChange={() => {}}
        dirty={false}
        onSave={() => {}}
      />
    );
    const options = getAllByRole('option');
    expect(options.length).toBe(2);
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    expect(options[0].getAttribute('data-on')).toBe('true');
    expect(options[1].getAttribute('aria-selected')).toBe('false');
    expect(options[1].getAttribute('data-on')).toBe('false');
  });

  it('renders "Untitled" for empty title', () => {
    const { getByText } = render(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId={null}
        onSelect={() => {}}
        draft={null}
        onDraftChange={() => {}}
        dirty={false}
        onSave={() => {}}
      />
    );
    expect(getByText('First Note')).toBeTruthy();
    expect(getByText('Untitled')).toBeTruthy();
  });

  it('selecting a note calls onSelect', () => {
    const onSelect = vi.fn();
    const { getByText } = render(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId={null}
        onSelect={onSelect}
        draft={null}
        onDraftChange={() => {}}
        dirty={false}
        onSave={() => {}}
      />
    );
    fireEvent.click(getByText('First Note'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('draft: null renders empty state', () => {
    const { getByText, queryByLabelText } = render(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId={null}
        onSelect={() => {}}
        draft={null}
        onDraftChange={() => {}}
        dirty={false}
        onSave={() => {}}
      />
    );
    expect(getByText('Pick a note')).toBeTruthy();
    expect(queryByLabelText('Note body (Markdown)')).toBeNull();
  });

  it('title/body changes call onDraftChange', () => {
    const onDraftChange = vi.fn();
    const draft = { id: '1', title: 'T', body: 'B' };
    const { getByLabelText } = render(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId="1"
        onSelect={() => {}}
        draft={draft}
        onDraftChange={onDraftChange}
        dirty={false}
        onSave={() => {}}
      />
    );
    
    const titleInput = getByLabelText('Note title');
    fireEvent.change(titleInput, { target: { value: 'New T' } });
    expect(onDraftChange).toHaveBeenCalledWith({ id: '1', title: 'New T', body: 'B' });

    const bodyInput = getByLabelText('Note body (Markdown)');
    fireEvent.change(bodyInput, { target: { value: 'New B' } });
    expect(onDraftChange).toHaveBeenCalledWith({ id: '1', title: 'T', body: 'New B' });
  });

  it('write/preview toggle logic', () => {
    const draft = { id: '1', title: 'T', body: '<b>x</b>' };
    const { getByText, getByLabelText, container, queryByLabelText, rerender } = render(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId="1"
        onSelect={() => {}}
        draft={draft}
        onDraftChange={() => {}}
        dirty={false}
        onSave={() => {}}
        // No renderPreview initially
      />
    );

    // Initial is write mode
    expect(getByLabelText('Note body (Markdown)')).toBeTruthy();
    expect(container.querySelector('[data-note-preview-raw]')).toBeNull();

    // Switch to preview without renderPreview
    fireEvent.click(getByText('Preview'));
    expect(queryByLabelText('Note body (Markdown)')).toBeNull();
    const rawPreview = container.querySelector('[data-note-preview-raw]');
    expect(rawPreview).toBeTruthy();
    expect(rawPreview?.textContent).toBe('<b>x</b>');
    // Ensure no HTML injection
    expect(rawPreview?.querySelector('b')).toBeNull();

    // Rerender with renderPreview
    rerender(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId="1"
        onSelect={() => {}}
        draft={draft}
        onDraftChange={() => {}}
        dirty={false}
        onSave={() => {}}
        renderPreview={(md) => `<p>${md}</p>`}
      />
    );
    // Still in preview mode
    const prose = container.querySelector('[data-prose]');
    expect(prose).toBeTruthy();
    expect(prose?.innerHTML).toBe('<p><b>x</b></p>');
    expect(container.querySelector('[data-note-preview-raw]')).toBeNull();
  });

  it('save button and dirty label state', () => {
    const onSave = vi.fn();
    const { getByText, rerender } = render(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId="1"
        onSelect={() => {}}
        draft={{ id: '1', title: '', body: '' }}
        onDraftChange={() => {}}
        dirty={false}
        onSave={onSave}
      />
    );
    
    const saveBtn = getByText('Save') as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(true);
    expect(getByText('Saved')).toBeTruthy();

    rerender(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId="1"
        onSelect={() => {}}
        draft={{ id: '1', title: '', body: '' }}
        onDraftChange={() => {}}
        dirty={true}
        onSave={onSave}
      />
    );
    expect(saveBtn.disabled).toBe(false);
    expect(getByText('Unsaved changes')).toBeTruthy();

    fireEvent.click(saveBtn);
    expect(onSave).toHaveBeenCalled();
  });

  it('delete button presence and confirmation', async () => {
    const onDelete = vi.fn();
    const onConfirmDelete = vi.fn().mockResolvedValue(false);
    
    const { getByText, queryByText, rerender } = render(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId="1"
        onSelect={() => {}}
        draft={{ id: '1', title: '', body: '' }}
        onDraftChange={() => {}}
        dirty={false}
        onSave={() => {}}
      />
    );
    
    // No onDelete provided initially
    expect(queryByText('Delete')).toBeNull();

    rerender(
      <MarkdownNoteEditor
        notes={defaultNotes}
        activeId="1"
        onSelect={() => {}}
        draft={{ id: '1', title: '', body: '' }}
        onDraftChange={() => {}}
        dirty={false}
        onSave={() => {}}
        onDelete={onDelete}
        onConfirmDelete={onConfirmDelete}
      />
    );

    const delBtn = getByText('Delete');
    fireEvent.click(delBtn);
    
    await waitFor(() => {
        expect(onConfirmDelete).toHaveBeenCalled();
    });
    expect(onDelete).not.toHaveBeenCalled();

    // Now return true
    onConfirmDelete.mockResolvedValueOnce(true);
    fireEvent.click(delBtn);
    
    await waitFor(() => {
        expect(onDelete).toHaveBeenCalled();
    });
  });
});
