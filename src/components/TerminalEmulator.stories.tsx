import type { StoryDefault, Story } from '@ladle/react';
import { TerminalEmulator } from "./TerminalEmulator";
import type { TerminalLine } from "./TerminalEmulator";

const initialLines: TerminalLine[] = [
  { id: "l1", text: "cd ~/iac/gh-ai-ansible && ansible-playbook site.yml --check --diff", isCommand: true },
  { id: "l2", text: "PLAY [gh-ai] ***************************************************" },
  { id: "l3", text: "TASK [docker : ensure compose stack present] *******************" },
  { id: "l4", text: "changed: [gh-ai]" },
  { id: "l5", text: "PLAY RECAP *****************************************************" },
  { id: "l6", text: "gh-ai : ok=24  changed=3  unreachable=0  failed=0" },
];

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 720 }}>
    <TerminalEmulator initialLines={initialLines} />
  </div>
);

export const SlowTyping = () => (
  <div style={{ padding: "2rem", maxWidth: 720 }}>
    <TerminalEmulator initialLines={initialLines.slice(0, 3)} typingSpeed={60} />
  </div>
);
