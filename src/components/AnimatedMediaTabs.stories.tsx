import { AnimatedMediaTabs, type MediaTabItem } from "./AnimatedMediaTabs";

const workflowItems: MediaTabItem[] = [
  {
    id: "design",
    tabLabel: "Design System",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Dynamic abstract 3D ribbons and shapes",
    title: "Adaptive Design Tokens",
    description: "Harmonized typography, dynamic spacing scale, and fluid layout primitives.",
  },
  {
    id: "prototype",
    tabLabel: "Prototype",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "High-tech retro computer workstation with glowing monitors",
    title: "Interactive State Machines",
    description: "Realistic spring animations and gesture transitions simulating production feel.",
  },
  {
    id: "production",
    tabLabel: "Production",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Silicon microchip wafer circuitry glowing with golden connections",
    title: "Optimized Bundles",
    description: "Zero-runtime CSS extraction and sub-millisecond edge hydration.",
  },
];

const telemetryItems: MediaTabItem[] = [
  {
    id: "overview",
    tabLabel: "Overview",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Aerial view of turquoise ocean coastline",
    title: "Global Reach",
    description: "Multi-region edge cluster deployment spanning 35 availability zones.",
  },
  {
    id: "telemetry",
    tabLabel: "Telemetry",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Data analytics dashboard graphs and telemetry metrics",
    title: "Live Telemetry Feed",
    description: "Real-time streaming metrics with automated anomaly classification.",
  },
  {
    id: "security",
    tabLabel: "Security",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Cybersecurity shield encryption interface graphic",
    title: "Zero-Trust Enforcement",
    description: "Hardware enclave attestation and mutual TLS cryptographic verification.",
  },
];

const modeItems: MediaTabItem[] = [
  {
    id: "dark-mode",
    tabLabel: "Dark Studio",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Deep dark artistic rendering with rich gold accents",
    title: "Nocturne Palette",
    description: "Deep obsidian surfaces paired with high-contrast neon accents.",
  },
  {
    id: "light-mode",
    tabLabel: "Light Canvas",
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Bright vibrant geometric artistic composition",
    title: "Solar Canvas",
    description: "Clean porcelain canvases engineered for daylight clarity and focus.",
  },
];

const deckItems: MediaTabItem[] = [
  {
    id: "explore",
    tabLabel: "Explore",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Earth glowing from outer space",
    title: "Planetary Observation",
    description: "Synthesizing multi-spectral satellite imagery and topographical data.",
  },
  {
    id: "analyze",
    tabLabel: "Analyze",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Complex mathematical and physics equations",
    title: "Spectral Modeling",
    description: "Atmospheric and geographic density estimation using neural radiometers.",
  },
  {
    id: "forecast",
    tabLabel: "Forecast",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Dramatic clouds and atmospheric storm front",
    title: "Predictive Forecasting",
    description: "Dynamic simulation modeling high-velocity weather patterns over 72 hours.",
  },
  {
    id: "archive",
    tabLabel: "Archive",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Matrix of glowing green code and secure data storage",
    title: "Historical Records",
    description: "Immutable distributed storage for planetary climate records.",
  },
];

export const Default = () => (
  <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
    <AnimatedMediaTabs items={workflowItems} />
  </div>
);

export const PreselectedTab = () => (
  <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
    <AnimatedMediaTabs items={telemetryItems} defaultSelectedId="telemetry" />
  </div>
);

export const TwoTabs = () => (
  <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
    <AnimatedMediaTabs items={modeItems} />
  </div>
);

export const MultiItemDeck = () => (
  <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
    <AnimatedMediaTabs items={deckItems} />
  </div>
);
