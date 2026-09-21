import type { StoryDefault, Story } from '@ladle/react';
import { OrbitalCarousel, type OrbitalImage } from './OrbitalCarousel';

function createSvgDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

// 6-item Celestial Expedition Imagery
const CELESTIAL_IMAGES: OrbitalImage[] = [
  {
    id: 'nebula-aurora',
    alt: 'Nebula Aurora stellar observatory',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="50%" stop-color="#312e81"/>
            <stop offset="100%" stop-color="#4c1d95"/>
          </linearGradient>
          <radialGradient id="r1" cx="60%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
            <stop offset="50%" stop-color="#818cf8" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#g1)"/>
        <circle cx="360" cy="160" r="140" fill="url(#r1)"/>
        <circle cx="100" cy="80" r="2" fill="#fff" opacity="0.8"/>
        <circle cx="220" cy="50" r="1.5" fill="#fff" opacity="0.6"/>
        <circle cx="480" cy="90" r="2.5" fill="#fff" opacity="0.9"/>
        <circle cx="520" cy="240" r="1.5" fill="#fff" opacity="0.7"/>
        <circle cx="140" cy="280" r="2" fill="#fff" opacity="0.5"/>
        <rect x="36" y="290" width="100" height="24" rx="12" fill="rgba(56, 189, 248, 0.2)" stroke="rgba(56, 189, 248, 0.5)" stroke-width="1"/>
        <text x="86" y="306" fill="#38bdf8" font-size="11" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">MISSION 01</text>
        <text x="36" y="345" fill="#ffffff" font-size="22" font-family="system-ui, sans-serif" font-weight="700">Nebula Aurora</text>
        <text x="36" y="370" fill="#94a3b8" font-size="13" font-family="system-ui, sans-serif">Deep space stellar nursery observation</text>
      </svg>
    `),
  },
  {
    id: 'solar-flare',
    alt: 'Solar Flare Corona probe capture',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="50%" stop-color="#7c2d12"/>
            <stop offset="100%" stop-color="#991b1b"/>
          </linearGradient>
          <radialGradient id="r2" cx="70%" cy="30%" r="60%">
            <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.9"/>
            <stop offset="40%" stop-color="#f97316" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#18181b" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#g2)"/>
        <circle cx="420" cy="120" r="160" fill="url(#r2)"/>
        <rect x="36" y="290" width="100" height="24" rx="12" fill="rgba(251, 191, 36, 0.2)" stroke="rgba(251, 191, 36, 0.5)" stroke-width="1"/>
        <text x="86" y="306" fill="#fbbf24" font-size="11" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">MISSION 02</text>
        <text x="36" y="345" fill="#ffffff" font-size="22" font-family="system-ui, sans-serif" font-weight="700">Solar Flare Corona</text>
        <text x="36" y="370" fill="#fed7aa" font-size="13" font-family="system-ui, sans-serif">High-energy electromagnetic radiation probe</text>
      </svg>
    `),
  },
  {
    id: 'biosphere-array',
    alt: 'Biosphere Array exobiology relay',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#022c22"/>
            <stop offset="60%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#065f46"/>
          </linearGradient>
          <radialGradient id="r3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#34d399" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#022c22" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#g3)"/>
        <circle cx="300" cy="160" r="120" fill="url(#r3)"/>
        <rect x="36" y="290" width="100" height="24" rx="12" fill="rgba(52, 211, 153, 0.2)" stroke="rgba(52, 211, 153, 0.5)" stroke-width="1"/>
        <text x="86" y="306" fill="#34d399" font-size="11" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">MISSION 03</text>
        <text x="36" y="345" fill="#ffffff" font-size="22" font-family="system-ui, sans-serif" font-weight="700">Biosphere Array</text>
        <text x="36" y="370" fill="#a7f3d0" font-size="13" font-family="system-ui, sans-serif">Planetary exobiology telemetry relay</text>
      </svg>
    `),
  },
  {
    id: 'pulsar-beacon',
    alt: 'Pulsar Beacon pulse synchronizer',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#030712"/>
            <stop offset="50%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#3b0764"/>
          </linearGradient>
          <radialGradient id="r4" cx="65%" cy="35%" r="55%">
            <stop offset="0%" stop-color="#c084fc" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#g4)"/>
        <circle cx="390" cy="140" r="130" fill="url(#r4)"/>
        <rect x="36" y="290" width="100" height="24" rx="12" fill="rgba(192, 132, 252, 0.2)" stroke="rgba(192, 132, 252, 0.5)" stroke-width="1"/>
        <text x="86" y="306" fill="#c084fc" font-size="11" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">MISSION 04</text>
        <text x="36" y="345" fill="#ffffff" font-size="22" font-family="system-ui, sans-serif" font-weight="700">Pulsar Beacon</text>
        <text x="36" y="370" fill="#e9d5ff" font-size="13" font-family="system-ui, sans-serif">Periodic millisecond radio pulse synchronizer</text>
      </svg>
    `),
  },
  {
    id: 'event-horizon',
    alt: 'Event Horizon accretion disk telemetry',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#000000"/>
            <stop offset="60%" stop-color="#111827"/>
            <stop offset="100%" stop-color="#1f2937"/>
          </linearGradient>
          <radialGradient id="r5" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.7"/>
            <stop offset="40%" stop-color="#fb7185" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#g5)"/>
        <circle cx="300" cy="160" r="140" fill="url(#r5)"/>
        <circle cx="300" cy="160" r="50" fill="#000000"/>
        <rect x="36" y="290" width="100" height="24" rx="12" fill="rgba(244, 63, 94, 0.2)" stroke="rgba(244, 63, 94, 0.5)" stroke-width="1"/>
        <text x="86" y="306" fill="#f43f5e" font-size="11" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">MISSION 05</text>
        <text x="36" y="345" fill="#ffffff" font-size="22" font-family="system-ui, sans-serif" font-weight="700">Event Horizon</text>
        <text x="36" y="370" fill="#fecdd3" font-size="13" font-family="system-ui, sans-serif">Gravitational lensing and accretion disk capture</text>
      </svg>
    `),
  },
  {
    id: 'glacier-moon',
    alt: 'Glacier Exomoon cryogenic survey',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#082f49"/>
            <stop offset="60%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
          <radialGradient id="r6" cx="40%" cy="35%" r="55%">
            <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#082f49" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill="url(#g6)"/>
        <circle cx="240" cy="140" r="120" fill="url(#r6)"/>
        <rect x="36" y="290" width="100" height="24" rx="12" fill="rgba(14, 165, 233, 0.2)" stroke="rgba(14, 165, 233, 0.5)" stroke-width="1"/>
        <text x="86" y="306" fill="#38bdf8" font-size="11" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">MISSION 06</text>
        <text x="36" y="345" fill="#ffffff" font-size="22" font-family="system-ui, sans-serif" font-weight="700">Glacier Exomoon</text>
        <text x="36" y="370" fill="#bae6fd" font-size="13" font-family="system-ui, sans-serif">Sub-surface cryogenic geysers and thermal vents</text>
      </svg>
    `),
  },
];

// 3-item minimal equilateral set (corresponds to component test suite: 120deg ring)
const EQUILATERAL_IMAGES: OrbitalImage[] = [
  {
    id: 'reasoning-core',
    alt: 'Reasoning Core inference engine',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eq1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#eq1)"/>
        <circle cx="450" cy="140" r="90" fill="#38bdf8" opacity="0.3"/>
        <text x="40" y="80" fill="#38bdf8" font-size="14" font-family="system-ui, sans-serif" font-weight="700">NODE 01 / 03</text>
        <text x="40" y="160" fill="#ffffff" font-size="32" font-family="system-ui, sans-serif" font-weight="800">Reasoning Core</text>
        <text x="40" y="200" fill="#94a3b8" font-size="16" font-family="system-ui, sans-serif">Multi-step recursive planner &amp; validator</text>
        <rect x="40" y="310" width="130" height="32" rx="6" fill="#38bdf8" opacity="0.2"/>
        <text x="105" y="331" fill="#38bdf8" font-size="13" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">ACTIVE INFERENCE</text>
      </svg>
    `),
  },
  {
    id: 'memory-matrix',
    alt: 'Memory Matrix vector knowledge base',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eq2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#581c87"/>
            <stop offset="100%" stop-color="#172554"/>
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#eq2)"/>
        <circle cx="450" cy="140" r="90" fill="#c084fc" opacity="0.3"/>
        <text x="40" y="80" fill="#c084fc" font-size="14" font-family="system-ui, sans-serif" font-weight="700">NODE 02 / 03</text>
        <text x="40" y="160" fill="#ffffff" font-size="32" font-family="system-ui, sans-serif" font-weight="800">Memory Matrix</text>
        <text x="40" y="200" fill="#e9d5ff" font-size="16" font-family="system-ui, sans-serif">Episodic memory &amp; hybrid vector graph</text>
        <rect x="40" y="310" width="130" height="32" rx="6" fill="#c084fc" opacity="0.2"/>
        <text x="105" y="331" fill="#c084fc" font-size="13" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">INDEX READY</text>
      </svg>
    `),
  },
  {
    id: 'tool-mesh',
    alt: 'Tool Mesh distributed execution grid',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eq3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#eq3)"/>
        <circle cx="450" cy="140" r="90" fill="#34d399" opacity="0.3"/>
        <text x="40" y="80" fill="#34d399" font-size="14" font-family="system-ui, sans-serif" font-weight="700">NODE 03 / 03</text>
        <text x="40" y="160" fill="#ffffff" font-size="32" font-family="system-ui, sans-serif" font-weight="800">Tool Mesh</text>
        <text x="40" y="200" fill="#a7f3d0" font-size="16" font-family="system-ui, sans-serif">High-throughput sandboxed dispatch workers</text>
        <rect x="40" y="310" width="130" height="32" rx="6" fill="#34d399" opacity="0.2"/>
        <text x="105" y="331" fill="#34d399" font-size="13" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">32 DISPATCHERS</text>
      </svg>
    `),
  },
];

// 4-item Quadrant Set (90deg orbital spacing)
const QUADRANT_IMAGES: OrbitalImage[] = [
  {
    id: 'quad-analytics',
    alt: 'Realtime Analytics node',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#1e1b4b"/>
        <circle cx="480" cy="100" r="60" fill="#818cf8" opacity="0.4"/>
        <text x="40" y="120" fill="#a5b4fc" font-size="14" font-family="system-ui, sans-serif">QUADRANT ALPHA</text>
        <text x="40" y="170" fill="#ffffff" font-size="30" font-family="system-ui, sans-serif" font-weight="700">Realtime Analytics</text>
        <text x="40" y="210" fill="#c7d2fe" font-size="15" font-family="system-ui, sans-serif">Continuous ingestion of agent event logs</text>
      </svg>
    `),
  },
  {
    id: 'quad-supervision',
    alt: 'Policy Supervisor node',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#064e3b"/>
        <circle cx="480" cy="100" r="60" fill="#34d399" opacity="0.4"/>
        <text x="40" y="120" fill="#6ee7b7" font-size="14" font-family="system-ui, sans-serif">QUADRANT BETA</text>
        <text x="40" y="170" fill="#ffffff" font-size="30" font-family="system-ui, sans-serif" font-weight="700">Policy Supervisor</text>
        <text x="40" y="210" fill="#a7f3d0" font-size="15" font-family="system-ui, sans-serif">Deterministic guardrails and safety filters</text>
      </svg>
    `),
  },
  {
    id: 'quad-routing',
    alt: 'Dynamic Routing node',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#831843"/>
        <circle cx="480" cy="100" r="60" fill="#f472b6" opacity="0.4"/>
        <text x="40" y="120" fill="#fbcfe8" font-size="14" font-family="system-ui, sans-serif">QUADRANT GAMMA</text>
        <text x="40" y="170" fill="#ffffff" font-size="30" font-family="system-ui, sans-serif" font-weight="700">Dynamic Routing</text>
        <text x="40" y="210" fill="#fce7f3" font-size="15" font-family="system-ui, sans-serif">Model tier routing based on latency &amp; complexity</text>
      </svg>
    `),
  },
  {
    id: 'quad-evaluator',
    alt: 'Output Evaluator node',
    src: createSvgDataUri(`
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#713f12"/>
        <circle cx="480" cy="100" r="60" fill="#facc15" opacity="0.4"/>
        <text x="40" y="120" fill="#fde047" font-size="14" font-family="system-ui, sans-serif">QUADRANT DELTA</text>
        <text x="40" y="170" fill="#ffffff" font-size="30" font-family="system-ui, sans-serif" font-weight="700">Output Evaluator</text>
        <text x="40" y="210" fill="#fef08a" font-size="15" font-family="system-ui, sans-serif">Automated benchmarks and alignment scoring</text>
      </svg>
    `),
  },
];

export const Default = () => (
  <div style={{ padding: '2rem' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>Orbital Celestial Carousel</h3>
        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>
          Drag horizontally or use Left / Right Arrow keys to rotate the 3D orbital ring.
        </p>
      </div>
      <OrbitalCarousel images={CELESTIAL_IMAGES} />
    </div>
  </div>
);

export const EquilateralThreeItemOrbit = () => (
  <div style={{ padding: '2rem' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>Three-Item Equilateral Orbit (120°)</h3>
        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>
          Triangular geometry matching component unit tests. Focus transitions cleanly around the 360° ring.
        </p>
      </div>
      <OrbitalCarousel images={EQUILATERAL_IMAGES} />
    </div>
  </div>
);

export const QuadrantOrbit = () => (
  <div style={{ padding: '2rem' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>Quadrant Orbit (90°)</h3>
        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>
          Four orthogonal items representing system quadrants with crisp depth layering and lighting.
        </p>
      </div>
      <OrbitalCarousel images={QUADRANT_IMAGES} />
    </div>
  </div>
);
