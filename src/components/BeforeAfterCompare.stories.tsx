import type { StoryDefault, Story } from '@ladle/react';
import { BeforeAfterCompare } from "./BeforeAfterCompare";

function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

const rawSensorImage = createSvgDataUri(`
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="raw-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <filter id="sensor-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.2 0"/>
      <feBlend in="SourceGraphic" in2="noise" mode="overlay"/>
    </filter>
  </defs>
  <rect width="800" height="450" fill="url(#raw-sky)"/>
  <polygon points="0,320 180,240 320,290 500,200 680,310 800,250 800,450 0,450" fill="#131d2e"/>
  <polygon points="0,370 120,330 280,360 440,310 600,350 750,320 800,340 800,450 0,450" fill="#0d1522"/>
  <circle cx="620" cy="110" r="32" fill="#64748b" opacity="0.6"/>
  <rect y="400" width="800" height="50" fill="#070b12"/>
  <rect width="800" height="450" fill="transparent" filter="url(#sensor-noise)"/>
</svg>
`);

const enhancedHdrImage = createSvgDataUri(`
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hdr-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="45%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <linearGradient id="aurora-glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0"/>
      <stop offset="35%" stop-color="#10b981" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#818cf8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="luminous-moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f8fafc" stop-opacity="1"/>
      <stop offset="35%" stop-color="#e0f2fe" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="450" fill="url(#hdr-sky)"/>
  <path d="M0,150 Q200,60 400,120 T800,80 L800,240 Q600,180 400,220 T0,180 Z" fill="url(#aurora-glow)"/>
  <circle cx="80" cy="40" r="1.5" fill="#ffffff" opacity="0.9"/>
  <circle cx="150" cy="90" r="1" fill="#ffffff" opacity="0.7"/>
  <circle cx="240" cy="35" r="2" fill="#ffffff" opacity="0.95"/>
  <circle cx="340" cy="80" r="1.2" fill="#ffffff" opacity="0.8"/>
  <circle cx="480" cy="50" r="1.8" fill="#ffffff" opacity="0.9"/>
  <circle cx="700" cy="70" r="1.5" fill="#ffffff" opacity="0.85"/>
  <circle cx="760" cy="30" r="2" fill="#ffffff" opacity="0.9"/>
  <circle cx="620" cy="110" r="50" fill="url(#luminous-moon)"/>
  <circle cx="620" cy="110" r="28" fill="#f8fafc"/>
  <polygon points="0,320 180,240 320,290 500,200 680,310 800,250 800,450 0,450" fill="#1e293b"/>
  <polygon points="180,240 220,270 320,290 280,270" fill="#38bdf8" opacity="0.35"/>
  <polygon points="500,200 540,240 680,310 630,280" fill="#818cf8" opacity="0.35"/>
  <polygon points="0,370 120,330 280,360 440,310 600,350 750,320 800,340 800,450 0,450" fill="#0f172a"/>
  <rect y="395" width="800" height="55" fill="#030712"/>
  <ellipse cx="620" cy="420" rx="70" ry="12" fill="#38bdf8" opacity="0.3"/>
</svg>
`);

const wireframeMockImage = createSvgDataUri(`
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="wf-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.8"/>
    </pattern>
  </defs>
  <rect width="800" height="450" fill="#0f172a"/>
  <rect width="800" height="450" fill="url(#wf-grid)"/>
  <rect x="40" y="30" width="720" height="50" rx="6" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 4"/>
  <circle cx="70" cy="55" r="14" fill="none" stroke="#64748b" stroke-width="1.5"/>
  <line x1="100" y1="55" x2="240" y2="55" stroke="#64748b" stroke-width="6" stroke-linecap="round"/>
  <line x1="640" y1="55" x2="730" y2="55" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
  <rect x="40" y="105" width="220" height="130" rx="8" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="65" y1="135" x2="160" y2="135" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
  <line x1="65" y1="170" x2="140" y2="170" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
  <line x1="65" y1="205" x2="190" y2="205" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <rect x="290" y="105" width="220" height="130" rx="8" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="315" y1="135" x2="410" y2="135" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
  <line x1="315" y1="170" x2="390" y2="170" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
  <line x1="315" y1="205" x2="440" y2="205" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <rect x="540" y="105" width="220" height="130" rx="8" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="565" y1="135" x2="660" y2="135" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
  <line x1="565" y1="170" x2="640" y2="170" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
  <line x1="565" y1="205" x2="690" y2="205" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <rect x="40" y="260" width="720" height="150" rx="8" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="70" y1="290" x2="210" y2="290" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
  <line x1="70" y1="380" x2="730" y2="380" stroke="#334155" stroke-width="1"/>
  <polyline points="80,360 180,340 280,355 380,320 480,335 580,295 680,310 720,280" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6 4"/>
</svg>
`);

const productionUiImage = createSvgDataUri(`
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="card-surface" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="cyan-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="chart-area" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg-grad)"/>
  <rect x="40" y="30" width="720" height="50" rx="8" fill="url(#card-surface)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <circle cx="70" cy="55" r="14" fill="url(#cyan-accent)"/>
  <text x="96" y="60" fill="#f8fafc" font-size="14" font-family="system-ui, sans-serif" font-weight="600">MORPH SYSTEM CONSOLE</text>
  <rect x="650" y="44" width="85" height="22" rx="11" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1"/>
  <text x="692" y="59" fill="#34d399" font-size="11" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">ONLINE</text>
  <rect x="40" y="105" width="220" height="130" rx="10" fill="url(#card-surface)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="60" y="132" fill="#94a3b8" font-size="12" font-family="system-ui, sans-serif">Fleet Throughput</text>
  <text x="60" y="172" fill="#f8fafc" font-size="28" font-family="system-ui, sans-serif" font-weight="700">12.8k <tspan font-size="14" fill="#38bdf8" font-weight="500">req/s</tspan></text>
  <text x="60" y="208" fill="#34d399" font-size="12" font-family="system-ui, sans-serif">+18.4% vs baseline</text>
  <rect x="290" y="105" width="220" height="130" rx="10" fill="url(#card-surface)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="310" y="132" fill="#94a3b8" font-size="12" font-family="system-ui, sans-serif">Active Cluster Nodes</text>
  <text x="310" y="172" fill="#f8fafc" font-size="28" font-family="system-ui, sans-serif" font-weight="700">48 <tspan font-size="14" fill="#a78bfa" font-weight="500">/ 50</tspan></text>
  <text x="310" y="208" fill="#a78bfa" font-size="12" font-family="system-ui, sans-serif">96% Allocation</text>
  <rect x="540" y="105" width="220" height="130" rx="10" fill="url(#card-surface)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="560" y="132" fill="#94a3b8" font-size="12" font-family="system-ui, sans-serif">Median Latency</text>
  <text x="560" y="172" fill="#f8fafc" font-size="28" font-family="system-ui, sans-serif" font-weight="700">4.2 <tspan font-size="14" fill="#38bdf8" font-weight="500">ms</tspan></text>
  <text x="560" y="208" fill="#34d399" font-size="12" font-family="system-ui, sans-serif">Nominal Service Level</text>
  <rect x="40" y="260" width="720" height="150" rx="10" fill="url(#card-surface)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="60" y="288" fill="#f8fafc" font-size="13" font-family="system-ui, sans-serif" font-weight="600">Realtime Dispatch Telemetry</text>
  <path d="M80,380 L80,360 Q130,345 180,340 T280,355 T380,320 T480,335 T580,295 T680,310 T720,280 L720,380 Z" fill="url(#chart-area)"/>
  <path d="M80,360 Q130,345 180,340 T280,355 T380,320 T480,335 T580,295 T680,310 T720,280" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
</svg>
`);

const dayThemeImage = createSvgDataUri(`
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="day-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="60%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#f0f9ff"/>
    </linearGradient>
    <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#facc15"/>
    </radialGradient>
  </defs>
  <rect width="800" height="450" fill="url(#day-sky)"/>
  <circle cx="640" cy="100" r="44" fill="url(#sun-glow)"/>
  <path d="M120,120 Q140,90 170,100 Q200,80 230,105 Q260,95 270,120 Z" fill="#ffffff" opacity="0.9"/>
  <path d="M350,150 Q370,130 395,140 Q415,125 440,140 Q460,135 470,150 Z" fill="#ffffff" opacity="0.75"/>
  <polygon points="0,320 200,230 380,290 560,210 720,280 800,240 800,450 0,450" fill="#93c5fd"/>
  <polygon points="0,360 160,300 320,340 480,280 640,330 800,290 800,450 0,450" fill="#60a5fa"/>
  <path d="M0,380 Q200,350 400,380 T800,360 L800,450 L0,450 Z" fill="#22c55e"/>
  <path d="M0,410 Q300,390 600,420 T800,400 L800,450 L0,450 Z" fill="#16a34a"/>
</svg>
`);

const nightThemeImage = createSvgDataUri(`
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="night-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <radialGradient id="night-moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
  </defs>
  <rect width="800" height="450" fill="url(#night-sky)"/>
  <circle cx="640" cy="100" r="40" fill="url(#night-moon)"/>
  <circle cx="100" cy="60" r="1.5" fill="#ffffff" opacity="0.8"/>
  <circle cx="180" cy="40" r="1.2" fill="#ffffff" opacity="0.9"/>
  <circle cx="260" cy="90" r="1" fill="#ffffff" opacity="0.6"/>
  <circle cx="340" cy="50" r="2" fill="#ffffff" opacity="0.95"/>
  <circle cx="440" cy="70" r="1.2" fill="#ffffff" opacity="0.7"/>
  <circle cx="520" cy="35" r="1.8" fill="#ffffff" opacity="0.85"/>
  <circle cx="740" cy="80" r="1.5" fill="#ffffff" opacity="0.8"/>
  <polygon points="0,320 200,230 380,290 560,210 720,280 800,240 800,450 0,450" fill="#1e293b"/>
  <polygon points="0,360 160,300 320,340 480,280 640,330 800,290 800,450 0,450" fill="#0f172a"/>
  <path d="M0,380 Q200,350 400,380 T800,360 L800,450 L0,450 Z" fill="#064e3b"/>
  <path d="M0,410 Q300,390 600,420 T800,400 L800,450 L0,450 Z" fill="#022c22"/>
  <circle cx="150" cy="390" r="3" fill="#a3e635" opacity="0.8"/>
  <circle cx="320" cy="420" r="2.5" fill="#facc15" opacity="0.75"/>
  <circle cx="500" cy="395" r="3" fill="#a3e635" opacity="0.9"/>
  <circle cx="680" cy="425" r="2" fill="#facc15" opacity="0.85"/>
</svg>
`);

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <div style={{ maxWidth: "800px" }}>
      <BeforeAfterCompare
        beforeImage={rawSensorImage}
        afterImage={enhancedHdrImage}
        beforeLabel="Raw Sensor (ISO 6400)"
        afterLabel="AI Denoised HDR"
        beforeAlt="Underexposed noisy raw capture"
        afterAlt="Restored high definition result"
        initialPosition={0.5}
      />
    </div>
  </div>
);

export const WireframeToRender = () => (
  <div style={{ padding: "2rem" }}>
    <div style={{ maxWidth: "800px" }}>
      <BeforeAfterCompare
        beforeImage={wireframeMockImage}
        afterImage={productionUiImage}
        beforeLabel="Wireframe Spec"
        afterLabel="Production UI"
        beforeAlt="Low-fidelity wireframe schematic"
        afterAlt="High-fidelity production dashboard"
        initialPosition={0.4}
      />
    </div>
  </div>
);

export const OffsetInitialPosition = () => (
  <div style={{ padding: "2rem" }}>
    <div style={{ maxWidth: "800px" }}>
      <BeforeAfterCompare
        beforeImage={rawSensorImage}
        afterImage={enhancedHdrImage}
        beforeLabel="Raw Sensor"
        afterLabel="AI Denoised HDR"
        beforeAlt="Underexposed noisy raw capture"
        afterAlt="Restored high definition result"
        initialPosition={0.25}
      />
    </div>
  </div>
);

export const WithoutLabels = () => (
  <div style={{ padding: "2rem" }}>
    <div style={{ maxWidth: "800px" }}>
      <BeforeAfterCompare
        beforeImage={dayThemeImage}
        afterImage={nightThemeImage}
        beforeAlt="Daylight landscape mode"
        afterAlt="Nighttime landscape mode"
        initialPosition={0.5}
      />
    </div>
  </div>
);
