import type { StoryDefault, Story } from '@ladle/react';
import { LiquidNavMenu } from "./LiquidNavMenu";
import type { LiquidNavActionProps } from "./LiquidNavMenu";

function glyph(char: string) {
  return (
    <span aria-hidden="true" style={{ fontSize: "1.1rem", lineHeight: 1 }}>
      {char}
    </span>
  );
}

const actions: LiquidNavActionProps[] = [
  { id: "compose", icon: glyph("✎"), label: "Compose", onClick: () => {} },
  { id: "attach", icon: glyph("⎘"), label: "Attach file", onClick: () => {} },
  { id: "record", icon: glyph("◉"), label: "Record audio", onClick: () => {} },
  { id: "share", icon: glyph("↗"), label: "Share thread", onClick: () => {} },
];

export const Default = () => (
  <div style={{ padding: "5rem", display: "flex", justifyContent: "center" }}>
    <LiquidNavMenu actions={actions} aria-label="Composer actions" />
  </div>
);

export const CustomTrigger = () => (
  <div style={{ padding: "5rem", display: "flex", justifyContent: "center" }}>
    <LiquidNavMenu actions={actions.slice(0, 3)} triggerIcon={glyph("＋")} aria-label="Quick actions" />
  </div>
);
