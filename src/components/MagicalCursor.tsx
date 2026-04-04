import { useEffect, useRef, useState, CSSProperties } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useStore } from '../store/useStore';

interface Trail {
  id: number;
  x: number;
  y: number;
  size: number;
  born: number;
}

export default function MagicalCursor() {
  const { themeColor } = useStore();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const trailIdRef = useRef(0);
  const lastTrailTime = useRef(0);
  const tick = useRef(0);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const cursorX = useSpring(mouseX, { stiffness: 300, damping: 28, mass: 0.4 });
  const cursorY = useSpring(mouseY, { stiffness: 300, damping: 28, mass: 0.4 });

  const ringX = useSpring(mouseX, { stiffness: 110, damping: 20, mass: 0.9 });
  const ringY = useSpring(mouseY, { stiffness: 110, damping: 20, mass: 0.9 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const now = Date.now();
      if (now - lastTrailTime.current > 45) {
        lastTrailTime.current = now;
        setTrails(prev => [
          ...prev.slice(-12),
          {
            id: trailIdRef.current++,
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 2.5 + 2,
            born: now,
          },
        ]);
      }
    };

    const checkHover = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const interactive = el?.closest('a, button, [role="button"], input, textarea, select, label');
      setIsHovering(!!interactive);
    };

    const onDown = (e: MouseEvent) => {
      setIsClicking(true);
      setClickPos({ x: e.clientX, y: e.clientY });
    };
    const onUp = () => {
      setIsClicking(false);
      setTimeout(() => setClickPos(null), 600);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousemove', checkHover);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrails(prev => prev.filter(t => now - t.born < 500));
      tick.current++;
    }, 80);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', checkHover);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      clearInterval(cleanup);
    };
  }, [mouseX, mouseY]);

  const now = Date.now();

  const ringStyle: CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    border: `1.5px solid ${themeColor}`,
    boxShadow: `0 0 14px ${themeColor}40`,
    pointerEvents: 'none',
  };

  const dotStyle: CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: themeColor,
    boxShadow: `0 0 10px ${themeColor}90, 0 0 22px ${themeColor}40`,
    pointerEvents: 'none',
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Trail particles */}
      {trails.map((trail) => {
        const age = now - trail.born;
        const progress = Math.min(age / 500, 1);
        const opacity = (1 - progress) * 0.28;
        const sz = trail.size * (1 - progress * 0.5);
        return (
          <div
            key={trail.id}
            style={{
              position: 'absolute',
              left: trail.x,
              top: trail.y,
              width: sz * 2,
              height: sz * 2,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              backgroundColor: themeColor,
              opacity,
              filter: `blur(${sz * 0.8}px)`,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Slow outer ring */}
      <motion.div
        style={{
          ...ringStyle,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 50 : isClicking ? 26 : 36,
          height: isHovering ? 50 : isClicking ? 26 : 36,
          opacity: isHovering ? 0.7 : 0.35,
          scale: isClicking ? 0.85 : 1,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />

      {/* Fast inner dot */}
      <motion.div
        style={{
          ...dotStyle,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isClicking ? 5 : isHovering ? 9 : 6,
          height: isClicking ? 5 : isHovering ? 9 : 6,
          opacity: 1,
        }}
        transition={{ duration: 0.12 }}
      />

      {/* Click ripple */}
      {clickPos && (
        <motion.div
          key={`ripple-${clickPos.x}-${clickPos.y}-${trailIdRef.current}`}
          style={{
            position: 'absolute',
            left: clickPos.x,
            top: clickPos.y,
            borderRadius: '50%',
            border: `1px solid ${themeColor}`,
            translateX: '-50%',
            translateY: '-50%',
            pointerEvents: 'none',
          }}
          initial={{ width: 10, height: 10, opacity: 0.8 }}
          animate={{ width: 60, height: 60, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      )}
    </div>
  );
}
