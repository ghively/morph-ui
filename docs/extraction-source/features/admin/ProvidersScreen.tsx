import { NotConfigured } from "../../components/primitives";

/**
 * Telemetry, Models and Evaluations are provider-backed views (spec §23). No
 * provider interface is configured in this build, so each says so plainly —
 * the prototype's sample numbers are never shipped as production truth.
 */
export function ProvidersScreen() {
  return (
    <div data-sec="cyan" data-screen="" style={{ overflow: "auto", height: "100%", padding: "18px var(--gut) 26px" }}>
      <div data-grid="" style={{ ["--min" as string]: "300px", maxWidth: 1180, margin: "0 auto" } as React.CSSProperties}>
        <NotConfigured title="Telemetry · not configured">Host and inference telemetry needs a metrics provider. None is connected, so nothing is shown rather than sample numbers.</NotConfigured>
        <NotConfigured title="Models · not configured">Matrix does not choose models. Model selection appears only when a connected agent runtime exposes it; none does yet.</NotConfigured>
        <NotConfigured title="Evaluations · not configured">Evaluation runs come from an evaluation provider. None is connected.</NotConfigured>
      </div>
    </div>
  );
}
