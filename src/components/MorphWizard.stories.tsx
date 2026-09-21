import { MorphWizard } from "./MorphWizard";
import type { MorphWizardStep } from "./MorphWizard";

function stepBody(title: string, description: string) {
  return (
    <div style={{ padding: "1rem 0", lineHeight: 1.6 }}>
      <h4 style={{ margin: "0 0 0.5rem" }}>{title}</h4>
      <p style={{ margin: 0, opacity: 0.8, fontSize: "0.9rem" }}>{description}</p>
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

export const WithBlockingValidation = () => (
  <div style={{ padding: "2rem", maxWidth: 560 }}>
    <MorphWizard
      steps={[
        { ...steps[0], onValidate: () => false },
        ...steps.slice(1),
      ]}
      onComplete={() => {}}
    />
  </div>
);
