import { GenerativePlaceholder } from "./GenerativePlaceholder";
import type { GenerativePlaceholderVariant } from "./GenerativePlaceholder";

const variants: GenerativePlaceholderVariant[] = [
  "text",
  "conversation",
  "card",
  "artifact",
  "table",
  "graph",
  "agent",
];

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 560 }}>
    <GenerativePlaceholder variant="conversation" />
  </div>
);

export const AllVariants = () => (
  <div style={{ padding: "2rem", display: "grid", gap: "2rem", maxWidth: 560 }}>
    {variants.map((variant) => (
      <section key={variant}>
        <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", letterSpacing: "0.12em", opacity: 0.6 }}>
          {variant.toUpperCase()}
        </h4>
        <GenerativePlaceholder variant={variant} />
      </section>
    ))}
  </div>
);
