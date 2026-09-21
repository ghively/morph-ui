import type { StoryDefault, Story } from '@ladle/react';
import { ContextMeter } from './ContextMeter';

const frame: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '420px',
  display: 'grid',
  gap: '1.5rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

export const Default = () => (
  <div style={frame}>
    <ContextMeter used={48200} total={200000} />
  </div>
);

export const Levels = () => (
  <div style={frame}>
    <ContextMeter used={62000} total={200000} label="Healthy — ok" />
    <ContextMeter used={168000} total={200000} label="Filling up — warn" />
    <ContextMeter used={193500} total={200000} label="Nearly full — danger" />
  </div>
);

export const SmallWindow = () => (
  <div style={frame}>
    <ContextMeter used={640} total={8000} label="Tool output budget" />
  </div>
);
