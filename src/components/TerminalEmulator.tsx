import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import './TerminalEmulator.css';

export interface TerminalLine {
  id: string;
  text: string;
  isCommand?: boolean;
}

export interface TerminalEmulatorRef {
  writeLine: (text: string, isCommand?: boolean) => void;
  clear: () => void;
}

export interface TerminalEmulatorProps {
  initialLines?: TerminalLine[];
  typingSpeed?: number;
  className?: string;
  'data-testid'?: string;
}

export const TerminalEmulator = forwardRef<TerminalEmulatorRef, TerminalEmulatorProps>(({
  initialLines = [],
  typingSpeed = 20,
  className = '',
  'data-testid': testId,
}, ref) => {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [typingLine, setTypingLine] = useState<{ id: string; text: string; current: string; isCommand: boolean } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<{ text: string, isCommand: boolean, resolve: () => void }[]>([]);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const processQueue = async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    const item = queueRef.current[0]!;
    
    if (reducedMotion) {
      setLines(prev => [...prev, { id: crypto.randomUUID(), text: item.text, isCommand: item.isCommand }]);
      queueRef.current.shift();
      item.resolve();
      isProcessingRef.current = false;
      processQueue();
      return;
    }

    const id = crypto.randomUUID();
    setTypingLine({ id, text: item.text, current: '', isCommand: item.isCommand });

    for (let i = 0; i <= item.text.length; i++) {
      await new Promise(r => setTimeout(r, typingSpeed));
      setTypingLine(prev => prev ? { ...prev, current: item.text.slice(0, i) } : null);
    }

    setLines(prev => [...prev, { id, text: item.text, isCommand: item.isCommand }]);
    setTypingLine(null);
    queueRef.current.shift();
    item.resolve();
    isProcessingRef.current = false;
    processQueue();
  };

  useImperativeHandle(ref, () => ({
    writeLine: (text: string, isCommand = false) => {
      new Promise<void>((resolve) => {
        queueRef.current.push({ text, isCommand, resolve });
        processQueue();
      });
    },
    clear: () => {
      setLines([]);
      setTypingLine(null);
      queueRef.current = [];
      isProcessingRef.current = false;
    }
  }), [reducedMotion, typingSpeed, processQueue]); // Dependencies needed if speed changes

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, typingLine]);

  return (
    <div
      className={`terminal-emulator ${className}`}
      data-testid={testId}
    >
      <div className="terminal-emulator-screen">
        <div className="terminal-emulator-scanlines" />
        <div className="terminal-emulator-glow" />
        <div className="terminal-emulator-content" ref={containerRef}>
          {lines.map(line => (
            <div key={line.id} className={`terminal-emulator-line ${line.isCommand ? 'command' : ''}`}>
              {line.isCommand && <span className="terminal-emulator-prompt">&gt; </span>}
              {line.text}
            </div>
          ))}
          {typingLine && (
            <div className={`terminal-emulator-line ${typingLine.isCommand ? 'command' : ''}`}>
              {typingLine.isCommand && <span className="terminal-emulator-prompt">&gt; </span>}
              {typingLine.current}<span className="terminal-emulator-cursor" />
            </div>
          )}
          {!typingLine && <div className="terminal-emulator-line"><span className="terminal-emulator-cursor" /></div>}
        </div>
      </div>
    </div>
  );
});

TerminalEmulator.displayName = 'TerminalEmulator';
