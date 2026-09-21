import { useState } from 'react';
import { VariablePromptInput } from './VariablePromptInput';

export default {
  title: 'VariablePromptInput',
  component: VariablePromptInput,
};

export const Default = () => {
  const [template, setTemplate] = useState(
    'Summarize {{topic}} for the {{audience}} team. Focus on {{timeframe}} and flag anything over {{threshold}}.',
  );
  const [ran, setRan] = useState<string | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
      <VariablePromptInput
        id="rag-prompt"
        label="Weekly digest prompt"
        template={template}
        onTemplateChange={setTemplate}
        onRun={(filled) => setRan(filled)}
      />
      {ran && <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>Ran with: {ran}</p>}
    </div>
  );
};
