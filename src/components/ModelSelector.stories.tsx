import type { StoryDefault, Story } from '@ladle/react';
import { useState } from 'react';
import { ModelSelector, type ModelInfo } from './ModelSelector';

const frame: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '420px',
  minHeight: '400px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const noteStyle: React.CSSProperties = {
  marginTop: '1rem',
  fontSize: '0.8125rem',
  color: '#64748b',
};

const models: ModelInfo[] = [
  { id: 'opus-5', label: 'Claude Opus 5', vendor: 'Anthropic', contextWindow: 1000000, tags: ['heavy', 'reasoning'], enabled: true },
  { id: 'sonnet-5', label: 'Claude Sonnet 5', vendor: 'Anthropic', contextWindow: 200000, tags: ['balanced'], enabled: true },
  { id: 'haiku-4-5', label: 'Claude Haiku 4.5', vendor: 'Anthropic', contextWindow: 200000, tags: ['fast', 'cheap'], enabled: true },
  { id: 'glm-4-6', label: 'GLM 4.6', vendor: 'Z.AI', contextWindow: 128000, tags: ['coding-plan'], enabled: true },
  { id: 'deepseek-chat', label: 'DeepSeek Chat', vendor: 'DeepSeek', contextWindow: 64000, enabled: false },
];

export const Default = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>('sonnet-5');

  return (
    <div style={frame}>
      <ModelSelector models={models} selectedId={selectedId} onSelect={setSelectedId} />
      <p style={noteStyle}>Selected: {selectedId ?? 'none'}</p>
    </div>
  );
};

export const Unselected = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  return (
    <div style={frame}>
      <ModelSelector
        models={models}
        selectedId={selectedId}
        onSelect={setSelectedId}
        placeholder="Pick a routing target"
      />
      <p style={noteStyle}>
        {selectedId
          ? `Selected: ${selectedId}`
          : 'No selection yet — the trigger shows the placeholder. DeepSeek Chat is disabled.'}
      </p>
    </div>
  );
};

export const SearchableList = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>('opus-5');

  const manyModels: ModelInfo[] = [
    ...models,
    { id: 'gpt-4o', label: 'GPT-4o', vendor: 'OpenAI', contextWindow: 128000, tags: ['multimodal'], enabled: true },
    { id: 'o3-mini', label: 'o3-mini', vendor: 'OpenAI', contextWindow: 200000, tags: ['reasoning'], enabled: true },
    { id: 'llama-3-70b', label: 'Llama 3 70B', vendor: 'Meta', contextWindow: 8000, tags: ['local'], enabled: true },
    { id: 'mistral-large', label: 'Mistral Large', vendor: 'Mistral', contextWindow: 32000, enabled: true },
    { id: 'qwen-2-5-coder', label: 'Qwen 2.5 Coder', vendor: 'Alibaba', contextWindow: 32000, tags: ['local', 'coding'], enabled: false },
  ];

  return (
    <div style={frame}>
      <ModelSelector models={manyModels} selectedId={selectedId} onSelect={setSelectedId} />
      <p style={noteStyle}>
        Ten models — above the eight-model threshold, so the popover adds a search field.
      </p>
    </div>
  );
};
