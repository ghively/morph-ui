import { useRef, useState } from "react";
import { PanelDestinationTransition } from "./PanelDestinationTransition";

const panelBody = (
  <div style={{ padding: "1.5rem", lineHeight: 1.6 }}>
    <h4 style={{ margin: "0 0 0.5rem" }}>Run detail</h4>
    <p style={{ margin: 0, opacity: 0.8, fontSize: "0.9rem" }}>
      Playbook site.yml finished in 48s — 3 changed, 0 failed, committed as 6fa5599.
    </p>
  </div>
);

export const Default = () => {
  const sourceRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(false);
  return (
    <div style={{ padding: "3rem", position: "relative", minHeight: 360 }}>
      <button ref={sourceRef} type="button" onClick={() => setActive((value) => !value)}>
        {active ? "Close panel" : "Open panel"}
      </button>
      <PanelDestinationTransition
        active={active}
        sourceRef={sourceRef}
        onTransitionEnd={() => {}}
      >
        {panelBody}
      </PanelDestinationTransition>
    </div>
  );
};

export const AlwaysActive = () => {
  const sourceRef = useRef<HTMLDivElement>(null);
  return (
    <div style={{ padding: "3rem", position: "relative", minHeight: 360 }}>
      <div ref={sourceRef} style={{ width: 120, height: 40, border: "1px dashed rgba(150,175,255,0.4)" }} />
      <PanelDestinationTransition active sourceRef={sourceRef} duration="d3">
        {panelBody}
      </PanelDestinationTransition>
    </div>
  );
};
