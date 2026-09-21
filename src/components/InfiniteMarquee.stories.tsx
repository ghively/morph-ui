import type { StoryDefault, Story } from '@ladle/react';
import { InfiniteMarquee } from "./InfiniteMarquee";

const tags = ["React 19", "Vite", "TypeScript", "Vitest", "Ladle", "Design Tokens"];

export const Default = () => (
  <div style={{ padding: "2rem 0" }}>
    <InfiniteMarquee>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: 999,
            border: "1px solid rgba(150, 175, 255, 0.3)",
            whiteSpace: "nowrap",
          }}
        >
          {tag}
        </span>
      ))}
    </InfiniteMarquee>
  </div>
);

export const FastAndTight = () => (
  <div style={{ padding: "2rem 0" }}>
    <InfiniteMarquee speed="8s" gap="0.75rem">
      {tags.map((tag) => (
        <strong key={tag} style={{ whiteSpace: "nowrap", fontSize: "1.5rem" }}>
          {tag}
        </strong>
      ))}
    </InfiniteMarquee>
  </div>
);
