import type { StoryDefault, Story } from '@ladle/react';
import { useState } from "react";
import { TokenPills } from "./TokenPills";

const options = [
  { id: "planning", label: "Planning" },
  { id: "coding", label: "Coding" },
  { id: "review", label: "Review" },
  { id: "deploy", label: "Deploy" },
  { id: "postmortem", label: "Postmortem" },
];

export const Default = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(["coding"]);
  return (
    <div style={{ padding: "2rem", maxWidth: 480 }}>
      <TokenPills
        options={options}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
        ariaLabel="Session phase"
      />
    </div>
  );
};

export const MultiSelect = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(["coding", "review"]);
  return (
    <div style={{ padding: "2rem", maxWidth: 480 }}>
      <TokenPills
        options={options}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
        multiSelect
        ariaLabel="Session phases"
      />
    </div>
  );
};
