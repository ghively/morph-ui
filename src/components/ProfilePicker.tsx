import './ProfilePicker.css';
import { useState, useEffect } from 'react';
import { Art, initials, type MediaItem } from './mediaLibrary.shared';
import type { User } from './ActiveSessions';

export interface ProfilePickerProps {
  users: User[];
  title?: string;
  /** Return true when the PIN is correct. */
  onVerifyPin?: (u: User, pin: string) => boolean | Promise<boolean>;
  onSelect: (u: User) => void;
  onAdd?: () => void;
  pinLength?: number;
  className?: string;
}

const asItem = (u: User): MediaItem => ({ id: u.id, type: 'Video', title: u.name, art: { Profile: u.avatar } });

export function ProfilePicker(p: ProfilePickerProps) {
  const len = p.pinLength ?? 4;
  const [who, setWho] = useState<User | null>(null);
  const [pin, setPin] = useState('');
  const [bad, setBad] = useState(false);

  const choose = (u: User) => {
    if (u.pin && p.onVerifyPin) {
      setWho(u);
      setPin('');
      setBad(false);
    } else {
      p.onSelect(u);
    }
  };

  useEffect(() => {
    if (!who || pin.length < len || !p.onVerifyPin) return;
    Promise.resolve(p.onVerifyPin(who, pin)).then(ok => {
      if (ok) {
        p.onSelect(who);
        setWho(null);
      } else {
        setBad(true);
        setTimeout(() => {
          setPin('');
          setBad(false);
        }, 650);
      }
    });
  }, [pin, who, len, p]);

  useEffect(() => {
    if (!who) return;
    const k = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) setPin(x => (x + e.key).slice(0, len));
      else if (e.key === 'Backspace') setPin(x => x.slice(0, -1));
      else if (e.key === 'Escape') setWho(null);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [who, len]);

  return (
    <section className={'ml ppA ' + (p.className || '')} aria-label={p.title ?? "Who's watching?"}>
      {!who ? (
        <>
          <h3 className="ppA-title">{p.title ?? "Who's watching?"}</h3>
          <ul className="ppA-grid">
            {p.users.map(u => (
              <li key={u.id}>
                <button
                  type="button"
                  className="ppA-user"
                  style={{ ['--c' as string]: u.accent ?? 'var(--morph-accent)' }}
                  onClick={() => choose(u)}
                  aria-label={u.name + (u.pin ? ', PIN protected' : '')}
                >
                  <span className="ppA-hex">
                    <Art
                      item={asItem(u)}
                      type="Profile"
                      shape="hex"
                      alt=""
                      empty={<span className="ppA-ini">{initials(u.name)}</span>}
                    />
                  </span>
                  <span className="ppA-name">{u.name}</span>
                  <span className="ppA-sub">{u.admin ? 'Admin' : u.pin ? 'PIN' : '\u00a0'}</span>
                </button>
              </li>
            ))}
            {p.onAdd && (
              <li>
                <button type="button" className="ppA-user ppA-add" onClick={p.onAdd}>
                  <span className="ppA-hex">
                    <span className="ppA-plus">+</span>
                  </span>
                  <span className="ppA-name">Add profile</span>
                  <span className="ppA-sub">&nbsp;</span>
                </button>
              </li>
            )}
          </ul>
        </>
      ) : (
        <div
          className="ppA-pin ml-glass"
          style={{ ['--c' as string]: who.accent ?? 'var(--morph-accent)' }}
          role="dialog"
          aria-label={'Enter PIN for ' + who.name}
        >
          <span className="ppA-hex ppA-sm">
            <Art
              item={asItem(who)}
              type="Profile"
              shape="hex"
              alt=""
              empty={<span className="ppA-ini">{initials(who.name)}</span>}
            />
          </span>
          <span className="ppA-name">{who.name}</span>
          <div
            className="ppA-dots"
            data-bad={bad ? '' : undefined}
            aria-live="polite"
            aria-label={pin.length + ' of ' + len + ' digits'}
          >
            {Array.from({ length: len }, (_, i) => (
              <i key={i} data-on={i < pin.length ? '' : undefined} />
            ))}
          </div>
          <div className="ppA-pad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
              k === '' ? (
                <span key={i} />
              ) : (
                <button
                  key={i}
                  type="button"
                  className="ppA-key"
                  aria-label={k === '⌫' ? 'Delete' : k}
                  onClick={() => (k === '⌫' ? setPin(x => x.slice(0, -1)) : setPin(x => (x + k).slice(0, len)))}
                >
                  {k}
                </button>
              )
            )}
          </div>
          <button type="button" className="ml-pill" data-size="sm" onClick={() => setWho(null)}>
            Back
          </button>
        </div>
      )}
    </section>
  );
}
