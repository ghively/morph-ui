import type { StoryDefault, Story } from '@ladle/react';
import { useState } from 'react';
import { MarkdownNoteEditor, type NoteDraft } from './MarkdownNoteEditor';

export default {
  component: MarkdownNoteEditor,
  title: 'MarkdownNoteEditor',
  parameters: {
    layout: 'fullscreen',
  },

};


export const 
  () => {
    const [activeId, setActiveId] = useState<string | null>('n1');
    const [draft, setDraft] = useState<NoteDraft | null>({
      id: 'n1',
      title: 'Meeting Notes',
      body: '# Discussion\n\n- Point 1\n- Point 2\n\n**Action Items:**\n1. Do this\n2. Do that',
    });
    const [dirty, setDirty] = useState(false);

    const handleDraftChange = (next: NoteDraft) => {
      setDraft(next);
      setDirty(true);
    };

    return (
      <MarkdownNoteEditor
        notes={[
          { id: 'n1', title: 'Meeting Notes', updatedLabel: '2h ago' },
          { id: 'n2', title: '', updatedLabel: '1d ago' },
        ]}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          if (id === 'n2') setDraft({ id: 'n2', title: '', body: '' });
          else setDraft({ id: 'n1', title: 'Meeting Notes', body: '...' });
          setDirty(false);
        }}
        draft={draft}
        onDraftChange={handleDraftChange}
        dirty={dirty}
        onSave={() => setDirty(false)}
        onDelete={() => {
          setDraft(null);
          setActiveId(null);
          setDirty(false);
        }}
        renderPreview={(md) => `<div><i>Rendered HTML simulation:</i><br/>${md.replace(/\n/g, '<br/>')}</div>`}
      />
    );
  };

export const 
  () => {
    return (
      <MarkdownNoteEditor
        notes={[]}
        activeId={null}
        onSelect={() => {}}
        draft={null}
        onDraftChange={() => {}}
        dirty={false}
        onSave={() => {}}
      />
    );
  };

export default {
  title: 'MarkdownNoteEditor',
} satisfies StoryDefault;
