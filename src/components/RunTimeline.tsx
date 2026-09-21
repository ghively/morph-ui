import './RunTimeline.css';

export interface RunTimelineStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'succeeded' | 'failed';
  startedAt?: string;
  endedAt?: string;
  detail?: string;
}

export interface RunTimelineProps {
  steps: RunTimelineStep[];
  dense?: boolean;
}

export function RunTimeline({ steps, dense = false }: RunTimelineProps) {
  return (
    <div data-run-timeline="" data-dense={dense ? "true" : undefined}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div 
            key={step.id} 
            data-run-timeline-step="" 
            data-status={step.status}
          >
            <div data-run-timeline-indicator-column="">
              <div data-run-timeline-dot="" />
              {!isLast && <div data-run-timeline-connector="" />}
            </div>
            
            <div data-run-timeline-content="">
              <div data-run-timeline-header="">
                <span data-run-timeline-label="">{step.label}</span>
                {step.startedAt && (
                  <span data-run-timeline-time="">
                    {new Date(step.startedAt).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>
              
              {step.detail && (
                <div data-run-timeline-detail="">
                  {step.detail}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
