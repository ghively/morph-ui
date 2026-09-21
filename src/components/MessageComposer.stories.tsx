import type { StoryDefault, Story } from '@ladle/react';
import { useState } from 'react';
import { MessageComposer, type ComposerDraft } from './MessageComposer';

export default {
  component: MessageComposer,
  title: 'MessageComposer',
  parameters: {
    layout: 'padded',
  };


export const 
  () => {
    const [draft, setDraft] = useState<ComposerDraft>({ text: '', mentions: [] });
    return (
      <MessageComposer
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => setDraft({ text: '', mentions: [] })}
        placeholder="Message..."
      />
    );
  };

export const 
  () => {
    const [draft, setDraft] = useState<ComposerDraft>({ text: '', mentions: [] });
    return (
      <MessageComposer
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => setDraft({ text: '', mentions: [] })}
        placeholder="Reply..."
        context={{
          mode: 'reply',
          senderName: 'Alice',
          preview: 'Hello there!',
          onCancel: () => {},
        }}
      />
    );
  };

export const 
  () => {
    const [draft, setDraft] = useState<ComposerDraft>({ text: 'Hello there!', mentions: [] });
    return (
      <MessageComposer
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => setDraft({ text: '', mentions: [] })}
        placeholder="Edit..."
        context={{
          mode: 'edit',
          preview: 'Hello there!',
          onCancel: () => {},
        }}
      />
    );
  };

export const 
  () => {
    const [draft, setDraft] = useState<ComposerDraft>({ text: '', mentions: [] });
    return (
      <MessageComposer
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => setDraft({ text: '', mentions: [] })}
        placeholder="Message..."
        offline={true}
      />
    );
  };

export const 
  () => {
    const [draft, setDraft] = useState<ComposerDraft>({ text: '', mentions: [] });
    return (
      <MessageComposer
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => setDraft({ text: '', mentions: [] })}
        placeholder="Message..."
        uploads={[
          { name: 'document.pdf', pct: 40 },
          { name: 'image.png', pct: 85 },
        ]}
      />
    );
  };

export default {
  title: 'MessageComposer',
} satisfies StoryDefault;
