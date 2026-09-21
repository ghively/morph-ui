import { TextSpectrum } from "./TextSpectrum";

export const Default = () => (
  <div style={{ padding: "3rem", fontSize: "2.5rem", fontWeight: 800 }}>
    <TextSpectrum>Full spectrum</TextSpectrum>
  </div>
);

export const CustomColors = () => (
  <div style={{ padding: "3rem", fontSize: "2.5rem", fontWeight: 800 }}>
    <TextSpectrum duration="4s" colors={["#6c9cf0", "#a855f7", "#22d3ee", "#63c79b", "#6c9cf0"]}>
      Full spectrum
    </TextSpectrum>
  </div>
);
