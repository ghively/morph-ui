import { useState } from 'react';
import { AnswerFeedback } from './AnswerFeedback';

export default {
  title: 'AnswerFeedback',
  component: AnswerFeedback,
};

export const Default = () => {
  const [last, setLast] = useState<string>('No feedback yet.');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 480 }}>
      <AnswerFeedback onSubmit={(f) => setLast(`rating=${f.rating} reasons=[${f.reasons.join(', ')}] correction=${f.correction || '—'}`)} />
      <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>{last}</p>
    </div>
  );
};
