import { EvalScoreCard } from './EvalScoreCard';

export default {
  title: 'EvalScoreCard',
  component: EvalScoreCard,
};

export const Default = () => (
  <div style={{ maxWidth: 420 }}>
    <EvalScoreCard
      title="Weekly answer quality"
      subtitle="500 sampled answers · human + LLM judges"
      dimensions={[
        { name: 'Groundedness', score: 94, target: 90 },
        { name: 'Completeness', score: 81, target: 85 },
        { name: 'Conciseness', score: 77, target: 70 },
        { name: 'Tone', score: 92, target: 80 },
      ]}
    />
  </div>
);
