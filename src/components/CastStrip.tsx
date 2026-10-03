import './CastStrip.css';
import { Art, useShelfScroll, useCast, personItem, type CastStripProps } from './mediaLibrary.shared';

export type { CastStripProps } from './mediaLibrary.shared';

export function CastStrip(p: CastStripProps) {
  const c = useCast(p);
  const s = useShelfScroll<HTMLUListElement>(c.cast.length);
  return (
    <section className={'ml csA ' + (p.className || '')} aria-label={p.title ?? 'Cast and crew'}>
      <header className="csA-head">
        <h3>{p.title ?? 'Cast & crew'}</h3>
        <span className="csA-sp" />
        <button type="button" className="csA-nav" aria-label="Previous" disabled={!s.prev} onClick={() => s.page(-1)}>
          ‹
        </button>
        <button type="button" className="csA-nav" aria-label="Next" disabled={!s.next} onClick={() => s.page(1)}>
          ›
        </button>
      </header>
      <ul className="csA-track" ref={s.ref} onScroll={s.onScroll} onKeyDown={c.onKeyDown}>
        {c.cast.map(x => (
          <li key={x.id}>
            <button type="button" className="csA-person" data-person="" onClick={() => c.select(x)} aria-label={x.name + (x.role ? ', ' + x.role : '')}>
              <Art item={personItem(x)} type="Profile" shape="hex" alt="" className="csA-art" />
              <span className="csA-name">{x.name}</span>
              {x.role && <span className="csA-role">{x.role}</span>}
            </button>
          </li>
        ))}
        {c.more > 0 && <li className="csA-more">+{c.more}</li>}
      </ul>
      {c.crew.length > 0 && (
        <dl className="csA-crew">
          {c.crew.map(g => (
            <div key={g.type} className="csA-g">
              <dt>{g.label}</dt>
              <dd>
                {g.people.map((x, i) => (
                  <button key={x.id} type="button" onClick={() => c.select(x)}>
                    {x.name}{i < g.people.length - 1 ? ',' : ''}
                  </button>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
