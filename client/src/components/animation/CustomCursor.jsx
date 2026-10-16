import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState('default'); // 'default' | 'hover' | 'magnetic' | 'image' | 'hidden'
  const [hoverLabel, setHoverLabel] = useState('');
  const [isFinePointer, setIsFinePointer] = useState(false);
  const trailingPosRef = useRef({ x: -100, y: -100 });
  const mousePosRef = useRef({ x: -100, y: -100 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer devices (strictly never on touch, coarse, or mobile devices)
    const isTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth <= 1024 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };

    const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const checkPointer = () => {
      if (isTouchDevice()) {
        setIsFinePointer(false);
      } else {
        setIsFinePointer(mediaQuery.matches);
      }
    };

    checkPointer();
    mediaQuery.addEventListener('change', checkPointer);
    window.addEventListener('resize', checkPointer);

    return () => {
      mediaQuery.removeEventListener('change', checkPointer);
      window.removeEventListener('resize', checkPointer);
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });

      // Target element inspection
      const target = e.target;
      if (!target) return;

      const interactive = target.closest('a, button, input, textarea, select, .clickable-card, .service-card, [data-cursor]');

      if (target.closest('input, textarea, select, [contenteditable]')) {
        setCursorState('hidden');
      } else if (target.closest('.btn-gold, .btn-header-gold, .portal-submit-btn')) {
        setCursorState('gold-halo');
        setHoverLabel('');
      } else if (interactive) {
        setCursorState('hover');
        setHoverLabel('');
      } else {
        setCursorState('default');
        setHoverLabel('');
      }
    };

    const handleMouseLeave = () => {
      setCursorState('hidden');
    };

    const handleMouseEnter = () => {
      setCursorState('default');
    };

    // Smooth trailing ring loop using lerp (linear interpolation)
    const renderTrailingCursor = () => {
      const lerp = 0.18;
      trailingPosRef.current.x += (mousePosRef.current.x - trailingPosRef.current.x) * lerp;
      trailingPosRef.current.y += (mousePosRef.current.y - trailingPosRef.current.y) * lerp;
      setTrailingPos({ x: trailingPosRef.current.x, y: trailingPosRef.current.y });
      animationFrameRef.current = requestAnimationFrame(renderTrailingCursor);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animationFrameRef.current = requestAnimationFrame(renderTrailingCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFinePointer]);

  if (!isFinePointer || cursorState === 'hidden') {
    return null;
  }

  return (
    <div className="custom-cursor-container" aria-hidden="true">
      {/* Precision inner center dot */}
      <div 
        className={`cursor-dot cursor-dot--${cursorState}`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
        }}
      />
      {/* Elegant outer trailing ring */}
      <div 
        className={`cursor-ring cursor-ring--${cursorState}`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`
        }}
      >
        {hoverLabel && <span className="cursor-label">{hoverLabel}</span>}
      </div>
    </div>
  );
};

export default CustomCursor;
