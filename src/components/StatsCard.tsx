import { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { LucideIcon, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  metricKey: 'users' | 'status' | 'commands' | 'tickets' | 'messages' | 'joins';
  delay?: number;
}

type TimeRange = '24H' | '7D' | '14D' | '1M' | '3M' | 'ALL';

const TIME_RANGES: TimeRange[] = ['24H', '7D', '14D', '1M', '3M', 'ALL'];

function generateData(metricKey: StatsCardProps['metricKey'], range: TimeRange): number[] {
  const seeds: Record<StatsCardProps['metricKey'], number> = {
    users: 2200, status: 99, commands: 24000, tickets: 160, messages: 61000, joins: 400,
  };
  const volatility: Record<StatsCardProps['metricKey'], number> = {
    users: 0.015, status: 0.008, commands: 0.05, tickets: 0.06, messages: 0.04, joins: 0.07,
  };
  const pointCount: Record<TimeRange, number> = {
    '24H': 24, '7D': 7, '14D': 14, '1M': 30, '3M': 90, 'ALL': 180,
  };
  const count = pointCount[range];
  const base = seeds[metricKey];
  const vol = volatility[metricKey];
  const trend = metricKey === 'status' ? 0 : 0.002;
  const data: number[] = [];
  let val = base * (1 - trend * count);
  for (let i = 0; i < count; i++) {
    // Seeded pseudo-random for deterministic output
    const r = Math.sin(i * 127.1 + metricKey.charCodeAt(0) * 311.7) * 0.5 + 0.5;
    val = val * (1 + trend) + (r - 0.5) * base * vol * 2;
    if (metricKey === 'status') val = Math.max(90, Math.min(100, val));
    data.push(Math.max(0, Math.round(val)));
  }
  return data;
}

function formatLabel(range: TimeRange, index: number, _total?: number): string {
  if (range === '24H') return `${index}h`;
  if (range === '7D') return ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index % 7];
  if (range === '14D') return `${index + 1}`;
  if (range === '1M') return index % 5 === 0 ? `${index + 1}` : '';
  if (range === '3M') {
    const month = Math.floor(index / 30);
    return index % 30 === 0 ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month % 12] : '';
  }
  return index % 30 === 0 ? `${Math.floor(index / 30)}m` : '';
}

function formatValue(val: number, metricKey: StatsCardProps['metricKey']): string {
  if (metricKey === 'status') return `${val}%`;
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return `${val}`;
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export default function StatsCard({ title, value, icon: Icon, metricKey, delay = 0 }: StatsCardProps) {
  const { themeColor } = useStore();
  const [showGraph, setShowGraph] = useState(false);
  const [activeRange, setActiveRange] = useState<TimeRange>('7D');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => generateData(metricKey, activeRange), [metricKey, activeRange]);

  const W = 320, H = 120, padL = 8, padR = 8, padT = 16, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: padT + chartH - ((v - minVal) / range) * chartH,
    val: v,
  }));

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${(padT + chartH).toFixed(2)} L ${points[0].x.toFixed(2)} ${(padT + chartH).toFixed(2)} Z`;

  const lastVal = data[data.length - 1];
  const firstVal = data[0];
  const delta = lastVal - firstVal;
  const deltaPercent = Math.round((delta / (firstVal || 1)) * 100);
  const isTrending = delta >= 0;

  const activePoint = hoverIdx !== null ? points[hoverIdx] : points[points.length - 1];

  // label step unused - handled inline

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 120 }}
      className="relative group rounded-2xl cursor-pointer"
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 60% 40%, ${themeColor}30, transparent 70%)` }}
      />

      <div
        className="relative overflow-hidden rounded-2xl border border-black/8 dark:border-white/8 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-2xl shadow-lg transition-all duration-300"
        onClick={() => setShowGraph(s => !s)}
      >
        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative p-5 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: themeColor, boxShadow: `0 4px 16px ${themeColor}50` }}
              >
                <Icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">{title}</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight mt-0.5">{value}</p>
              </div>
            </div>

            {/* Trend badge */}
            <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${isTrending ? 'bg-emerald-500/12 text-emerald-500' : 'bg-rose-500/12 text-rose-500'}`}>
              {isTrending ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {deltaPercent >= 0 ? '+' : ''}{deltaPercent}%
            </div>
          </div>

          {/* Expand toggle */}
          <div
            className="flex items-center justify-between gap-2 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-t border-black/5 dark:border-white/5 pt-2.5"
            onClick={(e) => { e.stopPropagation(); setShowGraph(s => !s); }}
          >
            <span>{showGraph ? 'Collapse' : 'Show chart'}</span>
            <motion.div animate={{ rotate: showGraph ? 180 : 0 }} transition={{ duration: 0.3, type: 'spring' }}>
              <ChevronDown size={13} />
            </motion.div>
          </div>

          {/* Graph */}
          <AnimatePresence initial={false}>
            {showGraph && (
              <motion.div
                key="graph"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-3">

                  {/* Time range selector */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5">
                    {TIME_RANGES.map((r) => (
                      <button
                        key={r}
                        onClick={() => setActiveRange(r)}
                        className="flex-1 py-1 rounded-lg text-[10px] font-bold transition-all duration-200"
                        style={activeRange === r ? { backgroundColor: themeColor, color: '#fff', boxShadow: `0 2px 8px ${themeColor}50` } : { color: 'rgb(161 161 170)' }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  {/* Chart */}
                  <div
                    className="relative rounded-xl overflow-hidden"
                    style={{ background: 'linear-gradient(160deg, #0f0f14 0%, #141420 100%)', height: `${H}px` }}
                  >
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 z-10"
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const relX = e.clientX - rect.left;
                        const ratio = relX / rect.width;
                        const idx = Math.round(ratio * (data.length - 1));
                        setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
                      }}
                      onMouseLeave={() => setHoverIdx(null)}
                    />

                    <svg
                      ref={svgRef}
                      viewBox={`0 0 ${W} ${H}`}
                      preserveAspectRatio="none"
                      className="w-full h-full absolute inset-0"
                    >
                      <defs>
                        <linearGradient id={`area-grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={themeColor} stopOpacity="0.35" />
                          <stop offset="60%" stopColor={themeColor} stopOpacity="0.08" />
                          <stop offset="100%" stopColor={themeColor} stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id={`line-grad-${metricKey}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={themeColor} stopOpacity="0.5" />
                          <stop offset="100%" stopColor={themeColor} stopOpacity="1" />
                        </linearGradient>
                        <filter id={`glow-${metricKey}`} x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Horizontal grid */}
                      {[0.25, 0.5, 0.75].map((frac, i) => (
                        <line
                          key={i}
                          x1={padL} y1={padT + chartH * frac}
                          x2={W - padR} y2={padT + chartH * frac}
                          stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"
                        />
                      ))}

                      {/* Area */}
                      <motion.path
                        d={areaPath}
                        fill={`url(#area-grad-${metricKey})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* Line */}
                      <motion.path
                        d={linePath}
                        fill="none"
                        stroke={`url(#line-grad-${metricKey})`}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        filter={`url(#glow-${metricKey})`}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
                      />

                      {/* Hover line */}
                      {hoverIdx !== null && (
                        <line
                          x1={activePoint.x} y1={padT}
                          x2={activePoint.x} y2={padT + chartH}
                          stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3"
                        />
                      )}

                      {/* Active dot */}
                      <motion.circle
                        cx={activePoint.x}
                        cy={activePoint.y}
                        r="4"
                        fill={themeColor}
                        stroke="white"
                        strokeWidth="1.5"
                        filter={`url(#glow-${metricKey})`}
                        animate={{ cx: activePoint.x, cy: activePoint.y }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      />
                      <motion.circle
                        cx={activePoint.x}
                        cy={activePoint.y}
                        r="8"
                        fill={themeColor}
                        fillOpacity="0.2"
                        animate={{ cx: activePoint.x, cy: activePoint.y }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      />

                      {/* X-axis labels */}
                      {points.map((p, i) => {
                        const label = formatLabel(activeRange, i, data.length);
                        if (!label) return null;
                        return (
                          <text
                            key={i}
                            x={p.x}
                            y={H - 6}
                            textAnchor="middle"
                            fontSize="7"
                            fill="rgba(255,255,255,0.22)"
                            fontFamily="ui-monospace,monospace"
                          >
                            {label}
                          </text>
                        );
                      })}
                    </svg>

                    {/* Tooltip */}
                    <motion.div
                      className="absolute z-20 pointer-events-none"
                      animate={{
                        left: `${((activePoint.x - padL) / chartW) * 100}%`,
                        top: `${((activePoint.y - padT) / chartH) * 100}%`,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      style={{ transform: 'translate(-50%, -130%)' }}
                    >
                      <div
                        className="rounded-lg px-2.5 py-1.5 text-white text-[11px] font-bold shadow-xl border border-white/15 backdrop-blur-md whitespace-nowrap"
                        style={{ backgroundColor: `${themeColor}cc` }}
                      >
                        {formatValue(activePoint.val, metricKey)}
                      </div>
                    </motion.div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Min', val: formatValue(minVal, metricKey) },
                      { label: 'Avg', val: formatValue(Math.round(data.reduce((a, b) => a + b, 0) / data.length), metricKey) },
                      { label: 'Max', val: formatValue(maxVal, metricKey) },
                    ].map(({ label, val }) => (
                      <div
                        key={label}
                        className="rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2 text-center"
                      >
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{label}</p>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
