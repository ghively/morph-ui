import { useRef, useState } from 'react';
import { TourOverlay } from './TourOverlay';

export default {
  title: 'TourOverlay',
  component: TourOverlay,
};

const panel: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 24,
  maxWidth: 420,
};

function Surface() {
  const search = useRef<HTMLInputElement>(null);
  const run = useRef<HTMLButtonElement>(null);
  const share = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <div style={{ padding: 32, display: 'grid', gap: 16, justifyItems: 'center' }}>
      <input ref={search} data-tour-search placeholder="Search" style={{ padding: 8 }} />
      <div style={{ display: 'flex', gap: 12 }}>
        <button ref={run} type="button" style={{ padding: '10px 16px' }}>Run agent</button>
        <button ref={share} type="button" style={{ padding: '10px 16px' }}>Share</button>
      </div>
      {open && (
        <TourOverlay
          open={open}
          onFinish={() => setOpen(false)}
          onSkip={() => setOpen(false)}
          steps={[
            {
              id: 'search',
              target: search,
              title: 'Find anything',
              body: 'Search across every conversation, file and agent run.',
            },
            {
              id: 'run',
              target: run,
              title: 'Launch an agent',
              body: 'Give it a goal; it reports back on this surface.',
            },
            {
              id: 'share',
              target: share,
              title: 'Share the result',
              body: 'One link, always current.',
            },
          ]}
        />
      )}
    </div>
  );
}

export const ThreeStepTour = () => <Surface />;

export const MidTour = () => {
  const btn = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState(1);
  return (
    <div style={panel}>
      <button ref={btn} type="button" style={{ justifySelf: 'center', padding: '10px 16px' }}>
        Target
      </button>
      <TourOverlay
        open
        step={step}
        onStepChange={setStep}
        onSkip={() => setStep(0)}
        onFinish={() => setStep(0)}
        steps={[
          { id: 'a', target: btn, title: 'First', body: 'Arrow keys move between steps.' },
          { id: 'b', target: btn, title: 'Second', body: 'Dots jump straight to a step.' },
          { id: 'c', target: btn, title: 'Third', body: 'The last Next finishes the tour.' },
        ]}
      />
    </div>
  );
};
