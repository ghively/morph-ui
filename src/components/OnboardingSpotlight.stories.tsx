import { useRef, useState } from 'react';
import { OnboardingSpotlight } from './OnboardingSpotlight';

export default {
  title: 'OnboardingSpotlight',
  component: OnboardingSpotlight,
};

function Demo({ step = 2, of = 5 }: { step?: number; of?: number }) {
  const btn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <div style={{ padding: 40, display: 'grid', gap: 16, justifyItems: 'center' }}>
      <p style={{ margin: 0 }}>The surface behind the spotlight stays visible.</p>
      <button ref={btn} type="button" style={{ padding: '10px 18px' }}>
        Publish workspace
      </button>
      {open && (
        <OnboardingSpotlight
          target={btn}
          open={open}
          step={step}
          of={of}
          title="Publish your workspace"
          onNext={() => setOpen(false)}
          onSkip={() => setOpen(false)}
          nextLabel="Got it"
        >
          Everything you build here is shared with your team in real time.
        </OnboardingSpotlight>
      )}
    </div>
  );
}

export const HighlightingAButton = () => <Demo />;

export const FirstStep = () => <Demo step={1} of={4} />;

export const BySelector = () => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ padding: 40 }}>
      <input data-tour-search placeholder="Search everything" style={{ padding: 8 }} />
      {open && (
        <OnboardingSpotlight
          target="[data-tour-search]"
          title="Search everything"
          onNext={() => setOpen(false)}
          onSkip={() => setOpen(false)}
          nextLabel="Start searching"
        >
          One field searches messages, files and agents.
        </OnboardingSpotlight>
      )}
    </div>
  );
};
