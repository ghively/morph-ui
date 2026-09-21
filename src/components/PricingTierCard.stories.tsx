import { PricingTierCard } from "./PricingTierCard";

const features = [
  "Up to 3 concurrent agents",
  "50k tool calls per month",
  "7-day trace retention",
  "Community support",
];

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 320 }}>
    <PricingTierCard
      title="Starter"
      price="$19/mo"
      features={features}
      ctaText="Start free trial"
      onToggle={() => {}}
    />
  </div>
);

export const Highlighted = () => (
  <div style={{ padding: "2rem", maxWidth: 320 }}>
    <PricingTierCard
      title="Fleet"
      price="$149/mo"
      highlight
      ctaText="Upgrade fleet"
      features={[
        "Unlimited concurrent agents",
        "1M tool calls per month",
        "400-day trace retention",
        <strong key="sla">99.9% uptime SLA</strong>,
      ]}
      onToggle={() => {}}
    />
  </div>
);
