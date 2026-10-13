import { TactileKeyboardBoard } from "./TactileKeyboardBoard";

export const Default = () => (
  <div style={{ padding: "2rem" }}>
    <TactileKeyboardBoard colorway="classic" onKeyPress={() => {}} />
  </div>
);

export const Cyber = () => (
  <div style={{ padding: "2rem" }}>
    <TactileKeyboardBoard colorway="cyber" onKeyPress={() => {}} />
  </div>
);

export const Neon = () => (
  <div style={{ padding: "2rem" }}>
    <TactileKeyboardBoard colorway="neon" onKeyPress={() => {}} />
  </div>
);

export const RetroAndMinimal = () => (
  <div style={{ padding: "2rem", display: "flex", flexWrap: "wrap", gap: 32 }}>
    <TactileKeyboardBoard colorway="retro" onKeyPress={() => {}} />
    <TactileKeyboardBoard colorway="minimal" onKeyPress={() => {}} />
  </div>
);
