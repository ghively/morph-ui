import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type MouseEvent, type TouchEvent } from 'react';
import './OrbitalCarousel.css';

export interface OrbitalImage {
  id: string;
  src: string;
  alt: string;
}

export interface OrbitalCarouselProps {
  images: OrbitalImage[];
  className?: string;
  'data-testid'?: string;
}

export function OrbitalCarousel({
  images,
  className = '',
  'data-testid': testId,
}: OrbitalCarouselProps) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const numImages = images.length;
  const anglePerImage = numImages > 0 ? 360 / numImages : 0;

  const updateFocusedIndex = useCallback((currentRotation: number) => {
    if (numImages === 0) return;
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const index = Math.round(normalizedRotation / anglePerImage) % numImages;
    // Because dragging right increases rotation and moves earlier images to front, the index maps inversely.
    const actualIndex = (numImages - index) % numImages;
    setFocusedIndex(actualIndex);
  }, [numImages, anglePerImage]);

  useEffect(() => {
    updateFocusedIndex(rotation);
  }, [rotation, updateFocusedIndex]);

  const applyInertia = useCallback(() => {
    if (Math.abs(velocityRef.current) > 0.1) {
      setRotation(prev => prev + velocityRef.current);
      velocityRef.current *= 0.95; // Friction
      rafRef.current = requestAnimationFrame(applyInertia);
    } else {
      // Snap to nearest image
      setRotation(prev => {
        const snapped = Math.round(prev / anglePerImage) * anglePerImage;
        return snapped;
      });
      velocityRef.current = 0;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  }, [anglePerImage]);

  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startRotationRef.current = rotation;
    velocityRef.current = 0;
    lastTimeRef.current = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startXRef.current;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    // Sensitivity factor
    const newRotation = startRotationRef.current + deltaX * 0.5;
    
    if (deltaTime > 0) {
       velocityRef.current = (deltaX * 0.5 - (rotation - startRotationRef.current)) / deltaTime * 16;
    }
    
    setRotation(newRotation);
    lastTimeRef.current = currentTime;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    rafRef.current = requestAnimationFrame(applyInertia);
  };

  // Mouse events
  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    handlePointerDown(e.clientX);
  };

  const onMouseMove = (e: MouseEvent) => {
    handlePointerMove(e.clientX);
  };

  const onMouseUp = () => {
    handlePointerUp();
  };

  const onMouseLeave = () => {
    if (isDragging) handlePointerUp();
  };

  // Touch events
  const onTouchStart = (e: TouchEvent) => {
    handlePointerDown(e.touches[0]!.clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    handlePointerMove(e.touches[0]!.clientX);
  };

  const onTouchEnd = () => {
    handlePointerUp();
  };

  // Keyboard support
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setRotation(prev => prev - anglePerImage);
    } else if (e.key === 'ArrowRight') {
      setRotation(prev => prev + anglePerImage);
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={`orbital-carousel ${className}`}
      data-testid={testId}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Orbital Image Carousel"
    >
      <div className="orbital-carousel-scene">
        <div 
          className="orbital-carousel-ring"
          style={{ transform: `translateZ(-300px) rotateY(${rotation}deg)` }}
          data-dragging={isDragging}
        >
          {images.map((img, i) => {
            const angle = i * anglePerImage;
            const isFocused = i === focusedIndex;
            return (
              <div
                key={img.id}
                className="orbital-carousel-item"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(300px)`,
                }}
                data-focused={isFocused}
                aria-hidden={!isFocused}
              >
                <img src={img.src} alt={img.alt} draggable="false" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="orbital-carousel-fallback">
         {images.map((img, i) => (
           <img 
              key={img.id} 
              src={img.src} 
              alt={img.alt} 
              className="orbital-carousel-fallback-item"
              data-focused={i === focusedIndex}
           />
         ))}
      </div>
    </div>
  );
}
