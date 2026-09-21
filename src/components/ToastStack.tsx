import { createContext, useContext, useState, useRef, useCallback } from 'react';
import type { ReactElement, ReactNode } from 'react';
import './ToastStack.css';

export type ToastTone = 'danger' | 'ok';

export interface ToastItem {
  id: number;
  text: string;
  note?: string;
  tone?: ToastTone;
}

export type ToastFn = (text: string, note?: string, tone?: ToastTone) => void;

const ToastContext = createContext<ToastFn>(() => {});

export interface ToastProviderProps {
  children: ReactNode;
  /** ms before a toast is dropped. Default 3600. */
  duration?: number;
  /** Max simultaneously visible. Default 3. */
  max?: number;
  /** Accessible name on the live region. Default 'Notifications'. */
  label?: string;
}

export function ToastProvider({
  children,
  duration = 3600,
  max = 3,
  label = 'Notifications'
}: ToastProviderProps): ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const actualToastFn = useCallback((text: string, note?: string, tone?: ToastTone) => {
    const id = ++seq.current;
    
    setToasts(t => {
      const next: ToastItem = { id, text, note, tone };
      return [...t.slice(-(max - 1)), next];
    });

    window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, [duration, max]);

  return (
    <ToastContext.Provider value={actualToastFn}>
      {children}
      <ToastStack toasts={toasts} label={label} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  return useContext(ToastContext);
}

export interface ToastStackProps {
  toasts: ToastItem[];
  label?: string;
  className?: string;
}

export function ToastStack({ toasts, label = 'Notifications', className = '' }: ToastStackProps): ReactElement {
  return (
    <div 
      data-osd="" 
      role="status" 
      aria-live="polite" 
      aria-label={label} 
      hidden={toasts.length === 0}
      className={className}
    >
      {toasts.map(t => (
        <div key={t.id} data-osditem="" data-tone={t.tone}>
          <span data-dot="" />
          {t.text}
          {t.note && (
            <span data-num="" data-meta="">
              {t.note}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
