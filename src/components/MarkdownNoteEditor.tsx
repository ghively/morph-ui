import { useState } from 'react';
import type { ReactNode } from 'react';
import './MarkdownNoteEditor.css';

export interface NoteSummary {
  id: string;
  title: string;
  /** Pre-formatted, e.g. '2 h ago'. */
  updatedLabel?: string;
}

export interface NoteDraft {
  id: string;
  title: string;
  body: string;
}

export interface MarkdownNoteEditorProps {
  notes: NoteSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  draft: NoteDraft | null;
  onDraftChange: (next: NoteDraft) => void;
  /** True ⇒ the Save button is enabled and the status line says so. */
  dirty: boolean;
  onSave: () => void;
  /** Omit to hide Delete (a never-saved draft has nothing to delete). */
  onDelete?: () => void;
  /** Return false to abort the delete. */
  onConfirmDelete?: () => boolean | Promise<boolean>;
  /** Host-supplied markdown → sanitised HTML. Without it, preview shows raw text. Note: Host MUST sanitise the output. */
  renderPreview?: (markdown: string) => string;
  /** Empty-list copy. */
  emptyTitle?: string;
  emptyHint?: ReactNode;
  /** Status line copy. Defaults: 'Unsaved changes' / 'Saved'. */
  dirtyLabel?: string;
  savedLabel?: string;
  /** Preview/Write labels. */
  writeLabel?: string;                // default 'Write'
  previewLabel?: string;              // default 'Preview'
  titlePlaceholder?: string;          // default 'Title'
  className?: string;
}

export function MarkdownNoteEditor({
  notes,
  activeId,
  onSelect,
  draft,
  onDraftChange,
  dirty,
  onSave,
  onDelete,
  onConfirmDelete,
  renderPreview,
  emptyTitle = 'Pick a note',
  emptyHint = 'Or start a new one.',
  dirtyLabel = 'Unsaved changes',
  savedLabel = 'Saved',
  writeLabel = 'Write',
  previewLabel = 'Preview',
  titlePlaceholder = 'Title',
  className,
}: MarkdownNoteEditorProps) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  const handleSelect = (id: string) => {
    onSelect(id);
    setMode('write'); // Reset to write when switching notes
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (onConfirmDelete) {
      const confirmed = await onConfirmDelete();
      if (!confirmed) return;
    }
    onDelete();
  };

  return (
    <div 
      className={className} 
      data-notesgrid="" 
      style={{ 
        flex: 1, 
        minHeight: 0, 
        display: "grid", 
        gridTemplateColumns: "minmax(200px, 280px) minmax(0,1fr)", 
        gap: "var(--s4)", 
        padding: "8px var(--gut) 20px" 
      }}
    >
      {/* List Column */}
      <div data-card="" data-pad="none" style={{ overflow: "auto" }}>
        <div role="listbox" aria-label="Notes list" data-statusrowlist="">
          {notes.map((note) => {
            const selected = note.id === activeId;
            return (
              <button
                key={note.id}
                type="button"
                data-row=""
                data-state=""
                role="option"
                aria-selected={selected}
                data-on={String(selected)}
                onClick={() => handleSelect(note.id)}
                style={{
                  textAlign: "left",
                  border: 0,
                  background: selected ? "var(--sec-soft)" : "transparent",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <div data-fill="">
                  <div data-strong="">{note.title || "Untitled"}</div>
                </div>
                {note.updatedLabel && <div data-meta="">{note.updatedLabel}</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Column */}
      <div data-card="" data-pad="roomy" style={{ display: "flex", flexDirection: "column", gap: "var(--s3)", minHeight: 0 }}>
        {!draft ? (
          <div data-empty-state="">
            <div data-empty-title="">{emptyTitle}</div>
            <div data-empty-body="">{emptyHint}</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: "var(--s3)", alignItems: "center" }}>
              <input
                data-field=""
                aria-label="Note title"
                placeholder={titlePlaceholder}
                value={draft.title}
                onChange={(e) => onDraftChange({ ...draft, title: e.target.value })}
                style={{ fontWeight: 700, flex: 1, minWidth: 0 }}
              />
              <div data-segmented-control="" role="radiogroup" aria-label="Mode">
                <button
                  type="button"
                  role="radio"
                  aria-checked={mode === 'write'}
                  data-active={String(mode === 'write')}
                  onClick={() => setMode('write')}
                >
                  {writeLabel}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={mode === 'preview'}
                  data-active={String(mode === 'preview')}
                  onClick={() => setMode('preview')}
                >
                  {previewLabel}
                </button>
              </div>
            </div>

            {mode === 'write' ? (
              <textarea
                data-field=""
                aria-label="Note body (Markdown)"
                value={draft.body}
                onChange={(e) => onDraftChange({ ...draft, body: e.target.value })}
                style={{ flex: 1, minHeight: 240, resize: "none", fontFamily: "var(--app-mono)", fontSize: "var(--t-ctl)" }}
              />
            ) : renderPreview ? (
              <div
                data-prose=""
                style={{ flex: 1, overflow: "auto" }}
                dangerouslySetInnerHTML={{ __html: renderPreview(draft.body) }}
              />
            ) : (
              <pre
                data-note-preview-raw=""
                style={{ flex: 1, overflow: "auto", whiteSpace: "pre-wrap" }}
              >
                {draft.body}
              </pre>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "var(--s3)", marginTop: "auto" }}>
              <button
                data-btn="fill"
                data-state=""
                disabled={!dirty}
                onClick={onSave}
              >
                Save
              </button>
              {onDelete && (
                <button
                  data-btn="text"
                  data-state=""
                  data-tone="danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
              <span data-meta="" style={{ marginLeft: "auto", alignSelf: "center" }}>
                {dirty ? dirtyLabel : savedLabel}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
