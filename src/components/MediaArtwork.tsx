import './MediaArtwork.css';
import { useState } from 'react';
import { Art, useMediaItem, useAccent, type ArtProps, type ArtResolution, type ItemSource } from './mediaLibrary.shared';

export interface MediaArtworkProps extends ItemSource, Omit<ArtProps, 'item'> {
  /** Show the resolved type + accent swatch under the image. */
  showMeta?: boolean;
  /** Receives the accent once it resolves (artwork → declared → blurhash → library). */
  onAccent?: (accent: string | undefined, source: string) => void;
}

export function MediaArtwork({ item: _i, raw, server, apiKey, showMeta, onAccent, onResolve, className, ...art }: MediaArtworkProps) {
  const it = useMediaItem({ item: _i, raw, server, apiKey });
  const acc = useAccent(it);
  const [r, setR] = useState<ArtResolution | null>(null);
  const fellBack = r && r.step > 0;
  return (
    <figure className={'ml maA ' + (className || '')} data-phase={r?.phase} style={acc.style} data-shape={art.shape ?? 'portrait'}>
      <Art
        {...art}
        item={it}
        className="maA-art"
        onResolve={x => {
          setR(x);
          onResolve?.(x);
          onAccent?.(acc.accent, acc.source);
        }}
      />
      {showMeta && (
        <figcaption className="maA-meta">
          <span className="maA-type" data-fb={fellBack ? '' : undefined}>
            {r?.phase === 'none' ? 'No artwork' : (r?.type ?? art.type ?? 'Primary') + (fellBack ? ' · fallback' : '')}
          </span>
          <span className="maA-acc" title={'Accent from ' + acc.source}>
            <i />
            {acc.source}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
