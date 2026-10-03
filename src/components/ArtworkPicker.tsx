import './ArtworkPicker.css';
import { useState, useMemo } from 'react';
import { Art, useAccent, list, type ArtType, type ArtShape, type MediaItem } from './mediaLibrary.shared';

export interface RemoteImage {
  url: string;
  type: ArtType;
  provider: string;
  width?: number;
  height?: number;
  lang?: string;
  rating?: number;
  votes?: number;
}

export interface ArtworkPickerProps {
  item: MediaItem;
  /** Candidates, e.g. from Jellyfin GET /Items/{id}/RemoteImages. */
  images: RemoteImage[];
  types?: ArtType[];
  defaultType?: ArtType;
  onApply: (img: RemoteImage) => void;
  onUpload?: (type: ArtType) => void;
  className?: string;
}

const SHAPE: Partial<Record<ArtType, ArtShape>> = {
  Primary: 'portrait',
  Backdrop: 'landscape',
  Thumb: 'landscape',
  Banner: 'banner',
  Logo: 'logo',
  Disc: 'square',
  Art: 'logo',
};

export function ArtworkPicker(p: ArtworkPickerProps) {
  const acc = useAccent(p.item);
  const types = p.types ?? ['Primary', 'Backdrop', 'Logo', 'Thumb', 'Banner', 'Disc'];
  const [type, setType] = useState<ArtType>(p.defaultType ?? types[0]!);
  const [prov, setProv] = useState('All');
  const [lang, setLang] = useState('All');
  const [sel, setSel] = useState<string | null>(null);
  const current = list(p.item.art[type])[0];
  const ofType = p.images.filter(i => i.type === type);
  const provs = ['All', ...new Set(ofType.map(i => i.provider))];
  const langs = ['All', ...new Set(ofType.map(i => i.lang || 'none'))];
  const shown = useMemo(
    () =>
      ofType
        .filter(i => (prov === 'All' || i.provider === prov) && (lang === 'All' || (i.lang || 'none') === lang))
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    [ofType, prov, lang]
  );
  const pick = shown.find(i => i.url === sel);
  const sh: ArtShape = SHAPE[type] ?? 'landscape';
  const fake = (u: string): MediaItem => ({ id: u, type: 'Video', title: p.item.title, art: { [type]: u } });

  return (
    <section className={'ml apA ml-glass ' + (p.className || '')} style={acc.style} aria-label={'Choose ' + type + ' image'}>
      <header className="apA-head">
        <div className="ml-tabs" role="tablist" aria-label="Image type">
          {types.map(t => {
            const n = p.images.filter(i => i.type === t).length;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={t === type}
                onClick={() => {
                  setType(t);
                  setSel(null);
                  setProv('All');
                  setLang('All');
                }}
              >
                {t}
                <small className="ml-num">{n}</small>
              </button>
            );
          })}
        </div>
        <div className="apA-filters">
          <label>
            <span>Source</span>
            <select className="ml-input" value={prov} onChange={e => setProv(e.target.value)}>
              {provs.map(x => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Language</span>
            <select className="ml-input" value={lang} onChange={e => setLang(e.target.value)}>
              {langs.map(x => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <div className="apA-grid" data-shape={sh} role="listbox" aria-label="Candidates">
        <div className="apA-cell" data-current="">
          <div className="apA-frame">
            <Art item={p.item} type={type} fallback={[]} shape={sh} alt="Current" empty={<span className="apA-none">No {type.toLowerCase()} yet</span>} />
          </div>
          <span className="apA-cap">
            <b>Current</b>
          </span>
        </div>
        {shown.map(i => (
          <button
            key={i.url}
            type="button"
            role="option"
            aria-selected={sel === i.url}
            className="apA-cell"
            onClick={() => setSel(i.url)}
            data-is-current={i.url === current ? '' : undefined}
          >
            <div className="apA-frame">
              <Art item={fake(i.url)} type={type} fallback={[]} shape={sh} alt="" />
            </div>
            <span className="apA-cap">
              <b>{i.provider}</b>
              <span className="ml-num">
                {i.width && i.height ? i.width + '×' + i.height : ''}
                {i.lang ? ' · ' + i.lang.toUpperCase() : ''}
              </span>
              {i.rating != null && (
                <span className="ml-num">
                  ★ {i.rating.toFixed(1)}
                  {i.votes ? ' (' + i.votes + ')' : ''}
                </span>
              )}
            </span>
          </button>
        ))}
        {p.onUpload && (
          <button type="button" className="apA-cell apA-up" onClick={() => p.onUpload!(type)}>
            <div className="apA-frame">
              <span>+ Upload</span>
            </div>
            <span className="apA-cap">
              <b>From device</b>
            </span>
          </button>
        )}
      </div>
      <footer className="apA-foot">
        <span className="ml-dim ml-sm">
          {shown.length} candidates{prov !== 'All' ? ' from ' + prov : ''}
        </span>
        <span className="ml-sp" />
        <button
          type="button"
          className="ml-pill"
          data-tone="accent"
          disabled={!pick || pick.url === current}
          onClick={() => pick && p.onApply(pick)}
        >
          Set as {type}
        </button>
      </footer>
    </section>
  );
}
