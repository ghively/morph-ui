import type { StoryDefault, Story } from '@ladle/react';
import { ScrollPinnedSequence } from "./ScrollPinnedSequence";
import type { SequenceStep } from "./ScrollPinnedSequence";

function stepBody(text: string) {
  return (
    <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.85, maxWidth: 420 }}>{text}</p>
  );
}

const steps: SequenceStep[] = [
  {
    id: "probe",
    title: "Probe the host",
    content: stepBody("Ground truth comes from the machine, not the wiki. A check run tells you what will change."),
  },
  {
    id: "classify",
    title: "Classify the facts",
    content: stepBody("Separate live state from durable decisions; only durable facts belong in documentation."),
  },
  {
    id: "run",
    title: "Run and verify",
    content: stepBody("Apply the change, confirm the service responds, and read the output rather than assuming it."),
  },
  {
    id: "commit",
    title: "Commit the ledger",
    content: stepBody("Git history is the audit trail. A deployed change left uncommitted is the new drift."),
  },
];

export const Default = () => <ScrollPinnedSequence steps={steps} />;
