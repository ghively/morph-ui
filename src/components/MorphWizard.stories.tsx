import { useEffect, useRef } from "react";
import { MorphWizard } from "./MorphWizard";
import type { MorphWizardStep } from "./MorphWizard";

function stepBody(title: string, description: string) {
  return (
    <div style={{ padding: "var(--s3) 0", lineHeight: 1.6 }}>
      <h4 style={{ margin: "0 0 var(--s2)", fontSize: "var(--t-h4)", fontWeight: 600, color: "var(--app-text)" }}>{title}</h4>
      <p style={{ margin: 0, fontSize: "var(--t-body)", color: "var(--app-dim)" }}>{description}</p>
    </div>
  );
}

const steps: MorphWizardStep[] = [
  {
    id: "target",
    title: "Choose target",
    content: stepBody("Target host", "Pick the machine that will receive the deployment."),
  },
  {
    id: "review",
    title: "Review plan",
    content: stepBody("Dry run", "Three tasks changed, no container restarts required."),
  },
  {
    id: "confirm",
    title: "Confirm",
    content: stepBody("Apply", "The run is committed to the host repository as it executes."),
  },
];

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 560 }}>
    <MorphWizard steps={steps} onComplete={() => {}} />
  </div>
);

/**
 * Step 1's validator refuses (no host picked). The story presses Next once on
 * mount so the blocked state — the alert, still on step 1 — is what renders.
 */
export const WithBlockingValidation = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>(".morph-wizard-btn-primary")?.click();
  }, []);
  return (
    <div ref={ref} style={{ padding: "2rem", maxWidth: 560 }}>
      <MorphWizard
        steps={[
          {
            ...steps[0],
            content: stepBody("Target host", "No host selected. Pick the machine that will receive the deployment."),
            onValidate: () => false,
            validationMessage: "Pick a target host before continuing.",
          },
          ...steps.slice(1),
        ]}
        onComplete={() => {}}
      />
    </div>
  );
};
