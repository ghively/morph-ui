import { useEffect, useState } from 'react';
import { StreamingStageIndicator } from './StreamingStageIndicator';
import type { RagStage } from './StreamingStageIndicator';

export default {
  title: 'StreamingStageIndicator',
  component: StreamingStageIndicator,
};

const FLOW: RagStage[] = ['searching', 'reading', 'drafting'];

export const Live = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % FLOW.length), 1600);
    return () => window.clearInterval(t);
  }, []);
  return <StreamingStageIndicator stage={FLOW[i]} />;
};

export const Settled = () => <StreamingStageIndicator streaming={false} />;
