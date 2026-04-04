import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Palette, Droplets, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

type Point = [number, number];

class Noise {
  private perm: number[];

  constructor(seed = 42) {
    this.perm = new Array(512);
    const p = new Array(256).fill(0).map((_, i) => i);
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  private fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  private grad(hash: number, x: number, y: number) {
    const h = hash & 3;
    return ((h & 1) === 0 ? x : -x) + ((h & 2) === 0 ? y : -y);
  }

  noise2D(x: number, y: number) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = this.fade(xf);
    const v = this.fade(yf);
    const aa = this.perm[this.perm[X] + Y];
    const ab = this.perm[this.perm[X] + Y + 1];
    const ba = this.perm[this.perm[X + 1] + Y];
    const bb = this.perm[this.perm[X + 1] + Y + 1];
    const top = this.lerp(this.grad(this.perm[aa], xf, yf), this.grad(this.perm[ba], xf - 1, yf), u);
    const bottom = this.lerp(this.grad(this.perm[ab], xf, yf - 1), this.grad(this.perm[bb], xf - 1, yf - 1), u);
    return this.lerp(top, bottom, v);
  }
}

function contourSegments(field: number[][], threshold: number, step: number): Point[][] {
  const lines: Point[][] = [];
  for (let y = 0; y < field.length - 1; y++) {
    for (let x = 0; x < field[0].length - 1; x++) {
      const v00 = field[y][x] - threshold;
      const v10 = field[y][x + 1] - threshold;
      const v01 = field[y + 1][x] - threshold;
      const v11 = field[y + 1][x + 1] - threshold;
      const idx = (v00 > 0 ? 8 : 0) | (v10 > 0 ? 4 : 0) | (v11 > 0 ? 2 : 0) | (v01 > 0 ? 1 : 0);
      if (idx === 0 || idx === 15) continue;

      const cx = x * step;
      const cy = y * step;
      const interp = (a: number, b: number) => {
        const denom = b - a;
        return Math.abs(denom) < 1e-6 ? 0.5 : -a / denom;
      };

      const top: Point = [cx + interp(v00, v10) * step, cy];
      const bottom: Point = [cx + interp(v01, v11) * step, cy + step];
      const left: Point = [cx, cy + interp(v00, v01) * step];
      const right: Point = [cx + step, cy + interp(v10, v11) * step];

      const push = (a: Point, b: Point) => lines.push([a, b]);

      switch (idx) {
        case 1: case 14: push(left, bottom); break;
        case 2: case 13: push(bottom, right); break;
        case 3: case 12: push(left, right); break;
        case 4: case 11: push(top, right); break;
        case 6: case 9: push(top, bottom); break;
        case 7: case 8: push(top, left); break;
        case 5: push(top, left); push(bottom, right); break;
        case 10: push(top, right); push(left, bottom); break;
      }
    }
  }
  return lines;
}

function hexToRgb(hex: string) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) }
    : { r: 139, g: 92, b: 246 };
}

const SWATCHES = [
  '#8b5cf6', '#6366f1', '#0ea5e9', '#14b8a6', '#22c55e', '#eab308',
  '#f97316', '#ef4444', '#ec4899', '#d946ef', '#ffffff', '#111827'
];

export default function TopographicBackground() {
  const { themeColor, setThemeColor, isDarkMode } = useStore();
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const noise = new Noise(42);
    const step = 28;
    const cols = Math.ceil(window.innerWidth / step) + 3;
    const rows = Math.ceil(window.innerHeight / step) + 3;

    // Slow, organic multi-layer drift — no mouse influence
    timeRef.current += 0.000055;
    const time = timeRef.current;

    // Get RGB from theme color for dynamic color influence
    const rgb = hexToRgb(themeColor);
    const colorIntensity = (rgb.r + rgb.g + rgb.b) / (255 * 3);

    const field: number[][] = [];
    for (let y = 0; y < rows; y++) {
      field[y] = [];
      for (let x = 0; x < cols; x++) {
        // Layer 1: slow base drift
        const nx1 = x * 0.055 + time * 0.38;
        const ny1 = y * 0.055 + time * 0.22;
        // Layer 2: medium frequency drift in opposite direction
        const nx2 = x * 0.12 + 80  - time * 0.28;
        const ny2 = y * 0.12 + 80  + time * 0.18;
        // Layer 3: very large, slow warping
        const nx3 = x * 0.028 + 200 + time * 0.12;
        const ny3 = y * 0.028 + 200 - time * 0.09;

        const a = noise.noise2D(nx1, ny1) * 1.1;
        const b = noise.noise2D(nx2, ny2) * 0.5;
        const c = noise.noise2D(nx3, ny3) * 1.2;

        field[y][x] = a + b + c;
      }
    }

    const min = Math.min(...field.flat());
    const max = Math.max(...field.flat());
    const range = max - min || 1;
    const levels = 22;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < levels; i++) {
      const t = min + (range / (levels - 1)) * i;
      const segments = contourSegments(field, t, step);
      const major = i % 4 === 0;

      // Theme color influence on line color
      if (isDarkMode) {
        const alpha = major ? 0.07 + colorIntensity * 0.04 : 0.035 + colorIntensity * 0.02;
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      } else {
        // Midnight black for light mode
        const alpha = major ? 0.12 + colorIntensity * 0.08 : 0.06 + colorIntensity * 0.04;
        ctx.strokeStyle = `rgba(10, 10, 15, ${alpha})`;
      }

      ctx.lineWidth = major ? 1.2 : 0.6;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      for (const line of segments) {
        ctx.beginPath();
        ctx.moveTo(line[0][0], line[0][1]);
        ctx.lineTo(line[1][0], line[1][1]);
        ctx.stroke();
      }
    }

    // Elevation labels
    ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = isDarkMode
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06)`
      : 'rgba(10, 10, 15, 0.05)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < levels; i += 4) {
      const t = min + (range / (levels - 1)) * i;
      const x = 40 + ((i * 181) % Math.max(180, window.innerWidth - 140));
      const y = 60 + ((i * 123) % Math.max(120, window.innerHeight - 120));
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((i * 13) % 28 - 14) * (Math.PI / 180));
      ctx.fillText(`${Math.round(t * 100)}m`, 0, 0);
      ctx.restore();
    }

    // Subtle theme color gradient overlay
    const gradient = ctx.createRadialGradient(
      window.innerWidth * 0.72, window.innerHeight * 0.84, 0,
      window.innerWidth * 0.72, window.innerHeight * 0.84, 260
    );
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isDarkMode ? 0.12 : 0.08})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    animationRef.current = requestAnimationFrame(draw);
  }, [isDarkMode, themeColor]);

  useEffect(() => {
    const onResize = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      draw();
    };

    window.addEventListener('resize', onResize);
    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  const palette = useMemo(() => SWATCHES, []);

  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-zinc-50 dark:bg-[#09090b] transition-colors duration-700">
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_45%,#000_58%,transparent_100%)] pointer-events-none" />
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="w-[300px] rounded-[28px] border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.25)] p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">Theme</p>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Color Picker</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: themeColor }}>
                  <Sparkles size={18} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2 mb-4">
                {palette.map((color) => (
                  <button
                    key={color}
                    onClick={() => setThemeColor(color)}
                    className="group relative h-10 rounded-2xl border border-black/5 dark:border-white/10 transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {themeColor === color && (
                      <span className="absolute inset-0 rounded-2xl ring-2 ring-white/80 ring-offset-2 ring-offset-transparent" />
                    )}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 dark:bg-black/30 text-zinc-900 dark:text-white">
                  <Palette size={18} />
                </span>
                <span className="flex-1">
                  <span className="block text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">Custom</span>
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="mt-1 h-10 w-full cursor-pointer appearance-none rounded-xl border-0 bg-transparent p-0"
                    aria-label="Custom color picker"
                  />
                </span>
              </label>

              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5"><Droplets size={14} /> Live palette</span>
                <span>{themeColor.toUpperCase()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((value) => !value)}
          className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/20 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl shadow-[0_14px_40px_rgba(0,0,0,0.16)] transition-transform hover:scale-105 active:scale-95"
          style={{ boxShadow: `0 0 0 1px ${themeColor}22, 0 12px 40px ${themeColor}22` }}
          aria-label="Open color picker"
        >
          <Palette size={20} className="text-zinc-800 dark:text-zinc-100 transition-transform group-hover:rotate-12" />
        </button>
      </div>
    </>
  );
}
