import { TextRipple } from "./TextRipple";

export const Default = () => (
  <div style={{ padding: "3rem", fontSize: "2.25rem", fontWeight: 700 }}>
    <TextRipple text="Ripple through the type" playOnMount />
  </div>
);

export const ClickToTrigger = () => (
  <div style={{ padding: "3rem", fontSize: "2.25rem", fontWeight: 700 }}>
    <TextRipple
      text="Click me to ripple"
      playOnMount={false}
      triggerOnClick
      duration="0.8s"
      stagger="0.04s"
    />
  </div>
);
