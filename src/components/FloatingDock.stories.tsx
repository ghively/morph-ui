import type { StoryDefault, Story } from '@ladle/react';
import { FloatingDock } from "./FloatingDock";
import type { DockItem } from "./FloatingDock";

function glyph(char: string) {
  return (
    <span aria-hidden="true" style={{ fontSize: "1.25rem", lineHeight: 1 }}>
      {char}
    </span>
  );
}

const items: DockItem[] = [
  { id: "home", label: "Workspace", icon: glyph("◎"), onClick: () => {} },
  { id: "agents", label: "Agents", icon: glyph("◈"), onClick: () => {} },
  { id: "search", label: "Search", icon: glyph("⌕"), onClick: () => {} },
  { id: "archive", label: "Archive", icon: glyph("▤"), onClick: () => {} },
  { id: "settings", label: "Settings", icon: glyph("⚙"), onClick: () => {} },
];

export const Default = () => (
  <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
    <FloatingDock items={items} />
  </div>
);

export const Vertical = () => (
  <div style={{ padding: "3rem", display: "flex", justifyContent: "center" }}>
    <FloatingDock items={items} horizontal={false} baseItemSize={44} maxItemSize={72} />
  </div>
);
