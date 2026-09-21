import { useState } from 'react';
import './KeyboardShowcase.css';

export interface KeyboardShowcaseProps {
  layout?: 'ANSI' | 'ISO';
  finish?: 'silver' | 'space-gray' | 'dark';
  className?: string;
  capsLockOn?: boolean;
}

export function KeyboardShowcase({ 
  layout = 'ANSI', 
  finish = 'silver', 
  className = '',
  capsLockOn = false 
}: KeyboardShowcaseProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handlePointerDown = (keyId: string) => {
    setPressedKeys(prev => new Set(prev).add(keyId));
  };

  const handlePointerUp = (keyId: string) => {
    setPressedKeys(prev => {
      const next = new Set(prev);
      next.delete(keyId);
      return next;
    });
  };

  // Mock generic keyboard layout based on Apple Magic Keyboard / generic compact ANSI/ISO
  const rows = [
    ['esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'eject'],
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete'],
    ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', layout === 'ANSI' ? '\\' : 'enter-iso-top'],
    ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", layout === 'ANSI' ? 'return' : 'enter-iso-bottom'],
    ['shift-l', layout === 'ISO' ? '\\' : null, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift-r'].filter(Boolean) as string[],
    ['fn', 'ctrl', 'opt-l', 'cmd-l', 'space', 'cmd-r', 'opt-r', 'arrows']
  ];

  return (
    <div className={`keyboard-showcase finish-${finish} layout-${layout.toLowerCase()} ${className}`} data-keyboard-showcase>
      <div className="keyboard-chassis">
        <div className="keyboard-keys-container">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((keyId) => {
                const isPressed = pressedKeys.has(keyId);
                const isCaps = keyId === 'caps';
                
                if (keyId === 'arrows') {
                  return (
                    <div key={keyId} className="keyboard-key-group">
                      <div className="keyboard-arrows-top">
                        <Key id="up" label="↑" onDown={handlePointerDown} onUp={handlePointerUp} isPressed={pressedKeys.has('up')} className="key-arrow" />
                      </div>
                      <div className="keyboard-arrows-bottom">
                        <Key id="left" label="←" onDown={handlePointerDown} onUp={handlePointerUp} isPressed={pressedKeys.has('left')} className="key-arrow" />
                        <Key id="down" label="↓" onDown={handlePointerDown} onUp={handlePointerUp} isPressed={pressedKeys.has('down')} className="key-arrow" />
                        <Key id="right" label="→" onDown={handlePointerDown} onUp={handlePointerUp} isPressed={pressedKeys.has('right')} className="key-arrow" />
                      </div>
                    </div>
                  );
                }

                return (
                  <Key 
                    key={keyId} 
                    id={keyId} 
                    label={getKeyLabel(keyId)} 
                    onDown={handlePointerDown} 
                    onUp={handlePointerUp} 
                    isPressed={isPressed} 
                    className={`key-${keyId}`}
                    isCaps={isCaps}
                    capsOn={isCaps && capsLockOn}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Key({ 
  id, 
  label, 
  onDown, 
  onUp, 
  isPressed, 
  className,
  isCaps,
  capsOn 
}: { 
  id: string; 
  label: string; 
  onDown: (id: string) => void; 
  onUp: (id: string) => void; 
  isPressed: boolean; 
  className: string;
  isCaps?: boolean;
  capsOn?: boolean;
}) {
  return (
    <button
      className={`keyboard-key ${className} ${isPressed ? 'pressed' : ''}`}
      onPointerDown={() => onDown(id)}
      onPointerUp={() => onUp(id)}
      onPointerLeave={() => onUp(id)}
      aria-label={`Key ${id}`}
    >
      <span className="key-label">{label}</span>
      {isCaps && <div className={`caps-led ${capsOn ? 'on' : ''}`} />}
    </button>
  );
}

function getKeyLabel(id: string): string {
  const labels: Record<string, string> = {
    'delete': 'delete',
    'tab': 'tab',
    'caps': 'caps lock',
    'return': 'return',
    'enter-iso-top': 'enter',
    'enter-iso-bottom': '',
    'shift-l': 'shift',
    'shift-r': 'shift',
    'fn': 'fn',
    'ctrl': 'control',
    'opt-l': 'option',
    'cmd-l': 'command',
    'space': '',
    'cmd-r': 'command',
    'opt-r': 'option',
    'eject': '⏏'
  };
  return labels[id] !== undefined ? labels[id] : id;
}
