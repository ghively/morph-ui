import type { ReactNode } from "react";
import "../src/tokens.css";
import "../src/frame.css";
import "./frame.css";

/**
 * Ladle renders stories onto its own bare canvas, which is white with the
 * browser default serif. These components are dark-frame designs, so without
 * the frame layer the catalog was showing them on the wrong surface entirely
 * (a disabled Button was near-white ink on white). Wrap every story in the
 * frame so the catalog shows them the way a host actually renders them.
 */
export const Provider = ({ children }: { children: ReactNode }) => (
  <div className="morph-frame" data-ladle-frame="">
    {children}
  </div>
);
