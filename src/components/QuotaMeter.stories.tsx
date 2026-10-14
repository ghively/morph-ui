import { QuotaMeter } from './QuotaMeter';

export default {
  title: 'QuotaMeter',
  component: QuotaMeter,
};

export const Levels = () => (
  <div style={{ display: 'grid', gap: 20, maxWidth: 380 }}>
    <QuotaMeter label="API credits" used={42} limit={100} unit="credits" hint="Resets in 6 days" />
    <QuotaMeter label="Storage" used={87} limit={100} unit="GB" hint="Approaching the plan cap" />
    <QuotaMeter label="Seats" used={12} limit={10} unit="seats" hint="2 teammates couldn't be invited" />
  </div>
);

export const CompactInline = () => (
  <div style={{ display: 'grid', gap: 12, maxWidth: 260 }}>
    <QuotaMeter variant="compact" label="Tokens" used={68} limit={100} unit="k tokens" />
    <QuotaMeter variant="compact" label="Tokens" used={104} limit={100} unit="k tokens" />
  </div>
);

export const CustomThreshold = () => (
  <QuotaMeter label="Build minutes" used={550} limit={600} unit="min" warnAt={0.5} hint="Warns at 50% by request" />
);
