import type { CSSProperties } from "react";
import type { Brand } from "../config";

/**
 * Production branding (spec §40).
 *
 * The mark is a theme's to state — each pack in theme/themes.ts sets `--mark`,
 * and the shell paints it through the `[data-mark]` mask. This function only
 * gets involved when a *logo URL* is in play, which is the one case that
 * outranks the theme: an operator who points `brand.logoUrl` at their own file
 * in config.json keeps their logo whichever skin the user picks. An inline
 * declaration is how that outranking is expressed — it beats the theme sheet
 * for this element, and it is absent otherwise so the theme's own mark wins.
 *
 * The URL has already been through `safeHttpUrl` (http/https, or a same-origin
 * path); the quote escape below is belt-and-braces so it cannot close the
 * `url()` it sits in whatever validation later allows.
 */
export function brandStyle(b: Brand): CSSProperties {
  if (!b.logoUrl) return {};
  return { ["--mark" as string]: `url("${b.logoUrl.replace(/"/g, "%22")}")` } as CSSProperties;
}

export function Wordmark({ brand }: { brand: Brand }) {
  const [first, ...rest] = brand.productName.split(/(?=[A-Z][a-z])/);
  return (
    <div data-fade="" data-wordmark="">
      {first}
      {rest.length ? <span>{rest.join("")}</span> : null}
    </div>
  );
}
