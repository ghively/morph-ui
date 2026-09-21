import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import './MorphWizard.css';

export interface MorphWizardStep {
  id: string;
  title: string;
  content: ReactNode;
  onValidate?: () => boolean | Promise<boolean>;
}

export interface MorphWizardProps {
  steps: MorphWizardStep[];
  onComplete?: () => void;
  className?: string;
  'data-testid'?: string;
}

export function MorphWizard({
  steps,
  onComplete,
  className = '',
  'data-testid': testId,
}: MorphWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const updateContainerHeight = useCallback(() => {
    if (contentRef.current && containerRef.current) {
      const height = contentRef.current.offsetHeight;
      containerRef.current.style.height = `${height}px`;
    }
  }, []);

  useEffect(() => {
    updateContainerHeight();
    const observer = new ResizeObserver(() => updateContainerHeight());
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    return () => observer.disconnect();
  }, [currentStepIndex, updateContainerHeight]);

  const handleNext = async () => {
    if (!currentStep) return;

    if (currentStep.onValidate) {
      setIsValidating(true);
      setValidationError(null);
      try {
        const isValid = await currentStep.onValidate();
        if (!isValid) {
          setValidationError('Validation failed');
          setIsValidating(false);
          return;
        }
      } catch {
        setValidationError('Error during validation');
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setValidationError(null);
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className={`morph-wizard ${className}`}
      data-testid={testId}
      data-step={currentStepIndex}
    >
      <div className="morph-wizard-header">
        <div className="morph-wizard-progress">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="morph-wizard-progress-dot"
              data-active={idx === currentStepIndex}
              data-completed={idx < currentStepIndex}
              title={step.title}
            />
          ))}
        </div>
        <div className="morph-wizard-title">{currentStep?.title}</div>
      </div>

      <div className="morph-wizard-container" ref={containerRef}>
        <div
          className="morph-wizard-content-slider"
          style={{ transform: `translateX(-${currentStepIndex * 100}%)` }}
        >
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="morph-wizard-step-content"
              aria-hidden={idx !== currentStepIndex}
              ref={idx === currentStepIndex ? contentRef : null}
            >
              {step.content}
            </div>
          ))}
        </div>
      </div>

      {validationError && (
        <div className="morph-wizard-error" role="alert">
          {validationError}
        </div>
      )}

      <div className="morph-wizard-footer">
        <button
          className="morph-wizard-btn morph-wizard-btn-secondary"
          onClick={handleBack}
          disabled={isFirstStep || isValidating}
        >
          Back
        </button>
        <button
          className="morph-wizard-btn morph-wizard-btn-primary"
          onClick={handleNext}
          disabled={isValidating}
        >
          {isValidating ? 'Validating...' : isLastStep ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}
