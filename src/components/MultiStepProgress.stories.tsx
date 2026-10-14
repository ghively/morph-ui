import { MultiStepProgress } from './MultiStepProgress';

export default {
  title: 'MultiStepProgress',
  component: MultiStepProgress,
};

export const Pipeline = () => (
  <MultiStepProgress
    label="Indexing pipeline"
    current={2}
    steps={[
      { id: 'fetch', label: 'Fetch sources', hint: '1.2s' },
      { id: 'parse', label: 'Parse documents', hint: '4.8s' },
      { id: 'embed', label: 'Embed chunks', hint: 'running…' },
      { id: 'index', label: 'Build index' },
      { id: 'verify', label: 'Verify' },
    ]}
  />
);

export const ErrorStep = () => (
  <MultiStepProgress
    current={3}
    steps={[
      { id: 'a', label: 'Connect', state: 'complete' },
      { id: 'b', label: 'Snapshot', state: 'complete' },
      { id: 'c', label: 'Upload', state: 'complete' },
      { id: 'd', label: 'Verify', state: 'error', hint: 'checksum mismatch' },
      { id: 'e', label: 'Publish', state: 'pending' },
    ]}
  />
);

export const Complete = () => (
  <MultiStepProgress
    current={3}
    steps={[
      { id: 'a', label: 'Collect' },
      { id: 'b', label: 'Review' },
      { id: 'c', label: 'Approve' },
      { id: 'd', label: 'Ship' },
    ]}
  />
);
