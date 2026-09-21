import type { StoryDefault, Story } from '@ladle/react';
import { InteractiveGlobe } from "./InteractiveGlobe";
import type { GlobeMarker } from "./InteractiveGlobe";

const markers: GlobeMarker[] = [
  { id: "sfo", lat: 37.77, lng: -122.42, label: "San Francisco" },
  { id: "lhr", lat: 51.51, lng: -0.13, label: "London" },
  { id: "nrt", lat: 35.69, lng: 139.69, label: "Tokyo" },
  { id: "syd", lat: -33.87, lng: 151.21, label: "Sydney" },
  { id: "gru", lat: -23.55, lng: -46.63, label: "São Paulo" },
];

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <InteractiveGlobe markers={markers} onMarkerClick={() => {}} />
  </div>
);

export const Empty = () => (
  <div style={{ padding: "2rem" }}>
    <InteractiveGlobe />
  </div>
);
