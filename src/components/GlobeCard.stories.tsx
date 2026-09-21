import { GlobeCard } from "./GlobeCard";

const markers = [
  { lat: 37.77, lng: -122.42 },
  { lat: 51.51, lng: -0.13 },
  { lat: 35.69, lng: 139.69 },
  { lat: -33.87, lng: 151.21 },
];

export const Default = () => (
  <div style={{ padding: "2rem", maxWidth: 380 }}>
    <GlobeCard
      title="Global Edge Network"
      description="Twelve points of presence across four regions, 42ms median round trip."
      markers={markers}
      icon={<span aria-hidden="true">◎</span>}
    />
  </div>
);

export const WithoutMarkers = () => (
  <div style={{ padding: "2rem", maxWidth: 380 }}>
    <GlobeCard title="Single Region" description="All traffic served from us-east-2." />
  </div>
);
