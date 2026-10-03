import { GenerativePlaceholder, type GenerativePlaceholderVariant } from './GenerativePlaceholder';

const variants: GenerativePlaceholderVariant[] = ['text', 'conversation', 'card', 'artifact', 'table', 'graph', 'agent'];

export const Default = () => (
  <div style={{ maxWidth: 560 }}>
    <GenerativePlaceholder variant="conversation" />
  </div>
);

export const AllVariants = () => (
  <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
    {variants.map(variant => (
      <section key={variant} style={{ display: 'grid', gap: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--app-faint)' }}>{variant}</div>
        <GenerativePlaceholder variant={variant} />
      </section>
    ))}
  </div>
);
