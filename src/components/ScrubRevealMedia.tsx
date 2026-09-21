import { useEffect, useRef, useState, useCallback, type MouseEvent, type TouchEvent } from 'react';
import './ScrubRevealMedia.css';

export interface ScrubRevealMediaProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  'data-testid'?: string;
}

export function ScrubRevealMedia({
  beforeImage,
  afterImage,
  className = '',
  'data-testid': testId,
}: ScrubRevealMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [progress, setProgress] = useState(0.5); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const imagesRef = useRef<{ before: HTMLImageElement | null, after: HTMLImageElement | null }>({
    before: null,
    after: null
  });

  const draw = useCallback((currentProgress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { before, after } = imagesRef.current;
    if (!before || !after) return;
    
    // Fill background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const splitX = canvas.width * currentProgress;
    
    // Helper to draw image covering the canvas
    const drawCover = (img: HTMLImageElement, isRightSide: boolean) => {
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;
      
      if (imgRatio > canvasRatio) {
        // Image is wider
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        // Image is taller
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.save();
      if (isRightSide) {
        ctx.beginPath();
        ctx.rect(splitX, 0, canvas.width - splitX, canvas.height);
        ctx.clip();
      } else {
         ctx.beginPath();
         ctx.rect(0, 0, splitX, canvas.height);
         ctx.clip();
      }
      
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();
    };

    // Draw Before (Left side)
    if (currentProgress > 0) {
       drawCover(before, false);
    }
    
    // Draw After (Right side)
    if (currentProgress < 1) {
       drawCover(after, true);
    }

    // Draw divider line
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Draw handle
    ctx.beginPath();
    ctx.arc(splitX, canvas.height / 2, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.stroke();
    
    // Handle arrows
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('↔', splitX, canvas.height / 2);

  }, []);

  useEffect(() => {
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setImagesLoaded(true);
        if (canvasRef.current && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          canvasRef.current.width = rect.width || 600;
          canvasRef.current.height = rect.height || 400;
          draw(0.5);
        }
      }
    };

    const img1 = new Image();
    img1.src = beforeImage;
    img1.onload = checkLoaded;
    imagesRef.current.before = img1;

    const img2 = new Image();
    img2.src = afterImage;
    img2.onload = checkLoaded;
    imagesRef.current.after = img2;
  }, [beforeImage, afterImage, draw]);

  useEffect(() => {
    if (imagesLoaded) {
      draw(progress);
    }
  }, [progress, imagesLoaded, draw]);

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, x / rect.width));
    setProgress(newProgress);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={`scrub-reveal-media ${className}`}
      data-testid={testId}
      onMouseDown={handlePointerDown}
      onMouseMove={(e: MouseEvent) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={(e: TouchEvent) => handlePointerMove(e.touches[0]!.clientX)}
      onTouchEnd={handlePointerUp}
      aria-label="Scrub to reveal before and after images"
      role="slider"
      aria-valuenow={Math.round(progress * 100)}
    >
      <canvas
        ref={canvasRef}
        className="scrub-reveal-canvas"
        data-dragging={isDragging}
      />
    </div>
  );
}
