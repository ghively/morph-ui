import type { StoryDefault, Story } from '@ladle/react';
import { ArchiveCollection } from "./ArchiveCollection";
import type { ArchiveEntry } from "./ArchiveCollection";

const entries: ArchiveEntry[] = [
  {
    id: "adr-014",
    date: "2026-09-02T09:15:00.000Z",
    title: "Per-host Ansible repositories",
    summary: "Split the mega-repo into one repository per machine; direct runs replace the CI pipeline.",
    tags: ["adr", "infra"],
  },
  {
    id: "adr-013",
    date: "2026-09-18T14:40:00.000Z",
    title: "Retire the worker swarm",
    summary: "Inline execution by default; delegate only when parallel lanes are justified.",
    tags: ["adr", "agents"],
  },
  {
    id: "note-221",
    date: "2026-08-11T18:05:00.000Z",
    title: "Token budget postmortem",
    summary: "42% of process waits burned the full ceiling — background long commands instead.",
    tags: ["postmortem"],
  },
];

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 680 }}>
    <ArchiveCollection entries={entries} onSelectEntry={() => {}} />
  </div>
);

export const GroupedByMonth = () => (
  <div style={{ padding: "2rem", maxWidth: 680 }}>
    <ArchiveCollection entries={entries} groupBy="month" onSelectEntry={() => {}} />
  </div>
);

export const Empty = () => (
  <div style={{ padding: "2rem", maxWidth: 680 }}>
    <ArchiveCollection entries={[]} emptyMessage="No archived entries match this filter." />
  </div>
);
