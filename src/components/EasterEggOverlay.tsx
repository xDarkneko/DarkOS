import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ShieldAlert, Terminal } from 'lucide-react';

export default function EasterEggOverlay() {
  const { easterEggClicks, themeColor } = useStore();
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (easterEggClicks >= 10) {
      setActive(true);
    }
  }, [easterEggClicks]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops = new Array(columns).fill(1);

    const chars = '01TEAMDARKNESSBOTONLINE98XDARKNEKO';

    let animId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = themeColor;
      ctx.font = 'bold 15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, themeColor]);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center overflow-hidden font-mono"
      >
        <canvas ref={canvasRef} className="absolute inset-0 opacity-40 pointer-events-none" />

        {/* Floating elements */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 max-w-lg">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.8)] mb-8"
          >
            <ShieldAlert size={48} className="text-white" />
          </motion.div>

          <h1 className="text-4xl font-black uppercase tracking-[0.2em] mb-4 text-red-500">
            SYSTEM CRASH DETECTED
          </h1>

          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Congratulations! You have cracked the code of Team Darkness. You have found the ultimate Secret Terminal Easter Egg.
          </p>

          <div className="w-full bg-zinc-900 border border-red-500/30 rounded-2xl p-4 text-left text-xs text-green-400 mb-8 flex flex-col gap-2">
            <div>&gt; BOT_INIT_SEQUENCE_BYPASS=TRUE</div>
            <div>&gt; X_DARK_NEKO_ROOT_ACCESS=GRANTED</div>
            <div>&gt; EXCLUSIVE_MODE=ACTIVATED</div>
            <div>&gt; CURRENT VERSION: v2.4.1 [DARKOS]</div>
          </div>

          <button
            onClick={() => setActive(false)}
            className="px-8 py-3 rounded-xl bg-white text-black font-bold flex items-center gap-2 hover:bg-gray-200 transition-all shadow-xl"
          >
            <Terminal size={18} /> BACK TO THE SURFACE
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
