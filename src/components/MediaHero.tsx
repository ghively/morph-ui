import './MediaHero.css';
import { Art, useHero, type MediaHeroProps } from './mediaLibrary.shared';
import { MediaInfoBadges } from './MediaInfoBadges';
import { TextBlurReveal } from './TextBlurReveal';

export type { MediaHeroProps } from './mediaLibrary.shared';

export function MediaHero(props: MediaHeroProps) {
  const h = useHero(props);
  if (!h.it) return null;
  const it = h.it;
  return (
    <section className={'ml mhA ' + (props.className || '')} style={h.acc.style} aria-label={it.title}>
      <div className="mhA-stage" aria-hidden="true">
        {h.backdrops.map((_, i) => (
          <Art
            key={i}
            item={it}
            type="Backdrop"
            fallback={['Thumb', 'Primary']}
            shape="fill"
            index={i}
            eager={i === 0}
            alt=""
            className="mhA-bd"
            // Backdrop fallback keeps the tinted placeholder surface but drops
            // its title / [ NO_ART ] text, which ghosted behind the synopsis.
            empty={<span className="mlArt-none" aria-hidden="true" />}
            style={{ opacity: i === h.rot.index ? 1 : 0 }}
          />
        ))}
        {h.tm.videoProps && <video className="mhA-video" data-ready={h.tm.videoReady ? '' : undefined} {...h.tm.videoProps} />}
        <div className="mhA-plate" />
      </div>
      {h.tm.audioProps && <audio {...h.tm.audioProps} />}
      <div className="mhA-top">
        {h.backdrops.length > 1 && (
          <div className="mhA-dots" role="group" aria-label="Backdrops">
            {h.backdrops.map((_, i) => (
              <button key={i} type="button" aria-label={'Backdrop ' + (i + 1)} aria-pressed={i === h.rot.index} onClick={() => h.rot.set(i)} />
            ))}
          </div>
        )}
        {h.tm.hasAny && (
          <button type="button" className="mhA-theme" aria-pressed={h.tm.on} onClick={h.tm.toggle} aria-label={h.tm.label}>
            <span aria-hidden="true">♪</span>
            {h.tm.on ? 'Theme on' : 'Theme muted'}
            <i data-on={h.tm.on ? '' : undefined} aria-hidden="true">
              <b />
              <b />
              <b />
            </i>
          </button>
        )}
      </div>
      <div className="mhA-panel">
        <Art
          item={it}
          type="Logo"
          shape="logo"
          className="mhA-logo"
          alt={it.title}
          empty={
            <h2 className="mhA-title">
              <TextBlurReveal key={it.id} text={it.title} mode="word" staggerDelay={70} />
            </h2>
          }
        />
        {it.tagline && <p className="mhA-tag">{it.tagline}</p>}
        <div className="mhA-meta ml-num">
          {[h.year, it.official, h.runtime, h.ends && 'Ends ' + h.ends].filter(Boolean).map((x, i) => (
            <span key={i}>{x}</span>
          ))}
        </div>
        <MediaInfoBadges item={it} omit={['official']} />
        {it.overview && <p className="mhA-ov">{it.overview}</p>}
        {it.genres?.length ? <div className="mhA-genres">{it.genres.join(' · ')}</div> : null}
        <div className="mhA-acts">
          <button type="button" className="mhA-play" onClick={h.play}>
            <span aria-hidden="true">▶</span>
            {h.resume ? 'Resume' : 'Play'}
            {h.resume && (
              <span className="mhA-pbar" aria-label={h.pct + '% watched'}>
                <i style={{ width: h.pct + '%' }} />
              </span>
            )}
          </button>
          {h.trailer && (
            <button type="button" className="mhA-ghost" onClick={h.trailer}>
              Trailer
            </button>
          )}
          <button type="button" className="mhA-icon" aria-pressed={h.played} aria-label={h.played ? 'Mark unplayed' : 'Mark played'} onClick={h.togglePlayed}>
            ✓
          </button>
          <button type="button" className="mhA-icon" data-fav="" aria-pressed={h.fav} aria-label={h.fav ? 'Remove favorite' : 'Add favorite'} onClick={h.toggleFav}>
            ★
          </button>
        </div>
      </div>
    </section>
  );
}
