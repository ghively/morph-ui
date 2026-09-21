import { useState, useEffect, useCallback } from 'react';
import './TactileKeyboardBoard.css';

export type KeyboardColorway = 'classic' | 'cyber' | 'retro' | 'minimal' | 'neon';

export interface TactileKeyboardBoardProps {
  colorway?: KeyboardColorway;
  className?: string;
  onKeyPress?: (key: string) => void;
}

export function TactileKeyboardBoard({ 
  colorway = 'classic', 
  className = '',
  onKeyPress 
}: TactileKeyboardBoardProps) {
  const [shiftActive, setShiftActive] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setActiveKeys(prev => new Set(prev).add(e.code));
    if (e.key === 'Shift') {
      setShiftActive(true);
    }
    if (onKeyPress) {
      onKeyPress(e.key);
    }
  }, [onKeyPress]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(e.code);
      return next;
    });
    if (e.key === 'Shift') {
      setShiftActive(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // A simplified 65% layout for demonstration
  const row1 = [
    { code: 'Escape', norm: 'Esc', shift: 'Esc', width: 1 },
    { code: 'Digit1', norm: '1', shift: '!', width: 1 },
    { code: 'Digit2', norm: '2', shift: '@', width: 1 },
    { code: 'Digit3', norm: '3', shift: '#', width: 1 },
    { code: 'Digit4', norm: '4', shift: '$', width: 1 },
    { code: 'Digit5', norm: '5', shift: '%', width: 1 },
    { code: 'Digit6', norm: '6', shift: '^', width: 1 },
    { code: 'Digit7', norm: '7', shift: '&', width: 1 },
    { code: 'Digit8', norm: '8', shift: '*', width: 1 },
    { code: 'Digit9', norm: '9', shift: '(', width: 1 },
    { code: 'Digit0', norm: '0', shift: ')', width: 1 },
    { code: 'Minus', norm: '-', shift: '_', width: 1 },
    { code: 'Equal', norm: '=', shift: '+', width: 1 },
    { code: 'Backspace', norm: 'Backspace', shift: 'Backspace', width: 2 },
  ];

  const row2 = [
    { code: 'Tab', norm: 'Tab', shift: 'Tab', width: 1.5 },
    { code: 'KeyQ', norm: 'q', shift: 'Q', width: 1 },
    { code: 'KeyW', norm: 'w', shift: 'W', width: 1 },
    { code: 'KeyE', norm: 'e', shift: 'E', width: 1 },
    { code: 'KeyR', norm: 'r', shift: 'R', width: 1 },
    { code: 'KeyT', norm: 't', shift: 'T', width: 1 },
    { code: 'KeyY', norm: 'y', shift: 'Y', width: 1 },
    { code: 'KeyU', norm: 'u', shift: 'U', width: 1 },
    { code: 'KeyI', norm: 'i', shift: 'I', width: 1 },
    { code: 'KeyO', norm: 'o', shift: 'O', width: 1 },
    { code: 'KeyP', norm: 'p', shift: 'P', width: 1 },
    { code: 'BracketLeft', norm: '[', shift: '{', width: 1 },
    { code: 'BracketRight', norm: ']', shift: '}', width: 1 },
    { code: 'Backslash', norm: '\\', shift: '|', width: 1.5 },
  ];

  const row3 = [
    { code: 'CapsLock', norm: 'Caps', shift: 'Caps', width: 1.75 },
    { code: 'KeyA', norm: 'a', shift: 'A', width: 1 },
    { code: 'KeyS', norm: 's', shift: 'S', width: 1 },
    { code: 'KeyD', norm: 'd', shift: 'D', width: 1 },
    { code: 'KeyF', norm: 'f', shift: 'F', width: 1 },
    { code: 'KeyG', norm: 'g', shift: 'G', width: 1 },
    { code: 'KeyH', norm: 'h', shift: 'H', width: 1 },
    { code: 'KeyJ', norm: 'j', shift: 'J', width: 1 },
    { code: 'KeyK', norm: 'k', shift: 'K', width: 1 },
    { code: 'KeyL', norm: 'l', shift: 'L', width: 1 },
    { code: 'Semicolon', norm: ';', shift: ':', width: 1 },
    { code: 'Quote', norm: "'", shift: '"', width: 1 },
    { code: 'Enter', norm: 'Enter', shift: 'Enter', width: 2.25 },
  ];

  const row4 = [
    { code: 'ShiftLeft', norm: 'Shift', shift: 'Shift', width: 2.25 },
    { code: 'KeyZ', norm: 'z', shift: 'Z', width: 1 },
    { code: 'KeyX', norm: 'x', shift: 'X', width: 1 },
    { code: 'KeyC', norm: 'c', shift: 'C', width: 1 },
    { code: 'KeyV', norm: 'v', shift: 'V', width: 1 },
    { code: 'KeyB', norm: 'b', shift: 'B', width: 1 },
    { code: 'KeyN', norm: 'n', shift: 'N', width: 1 },
    { code: 'KeyM', norm: 'm', shift: 'M', width: 1 },
    { code: 'Comma', norm: ',', shift: '<', width: 1 },
    { code: 'Period', norm: '.', shift: '>', width: 1 },
    { code: 'Slash', norm: '/', shift: '?', width: 1 },
    { code: 'ShiftRight', norm: 'Shift', shift: 'Shift', width: 2.75 },
  ];

  const row5 = [
    { code: 'ControlLeft', norm: 'Ctrl', shift: 'Ctrl', width: 1.25 },
    { code: 'MetaLeft', norm: 'Win', shift: 'Win', width: 1.25 },
    { code: 'AltLeft', norm: 'Alt', shift: 'Alt', width: 1.25 },
    { code: 'Space', norm: ' ', shift: ' ', width: 6.25 },
    { code: 'AltRight', norm: 'Alt', shift: 'Alt', width: 1.25 },
    { code: 'MetaRight', norm: 'Win', shift: 'Win', width: 1.25 },
    { code: 'ContextMenu', norm: 'Menu', shift: 'Menu', width: 1.25 },
    { code: 'ControlRight', norm: 'Ctrl', shift: 'Ctrl', width: 1.25 },
  ];

  const rows = [row1, row2, row3, row4, row5];

  const renderKey = (keyDef: typeof row1[0]) => {
    const isActive = activeKeys.has(keyDef.code);
    const legend = shiftActive ? keyDef.shift : keyDef.norm;
    
    return (
      <div 
        key={keyDef.code}
        className={`key-cap width-${keyDef.width.toString().replace('.', '-')} ${isActive ? 'is-active' : ''}`}
        onPointerDown={() => handleKeyDown({ code: keyDef.code, key: keyDef.norm } as KeyboardEvent)}
        onPointerUp={() => handleKeyUp({ code: keyDef.code, key: keyDef.norm } as KeyboardEvent)}
        onPointerLeave={() => {
          if (isActive) {
            handleKeyUp({ code: keyDef.code, key: keyDef.norm } as KeyboardEvent);
          }
        }}
      >
        <div className="key-top">
          {legend}
        </div>
      </div>
    );
  };

  return (
    <div data-tactile-keyboard-board className={`colorway-${colorway} ${className}`}>
      <div className="keyboard-chassis">
        {rows.map((row, idx) => (
          <div key={idx} className="keyboard-row">
            {row.map(renderKey)}
          </div>
        ))}
      </div>
    </div>
  );
}
