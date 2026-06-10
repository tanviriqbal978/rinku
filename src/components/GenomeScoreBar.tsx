import React, { useEffect, useState } from 'react';

interface GenomeScoreBarProps {
  label: string;
  value: number;
  icon: string;
  delay?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const traitColors: Record<string, { bar: string; glow: string; text: string }> = {
  Builder:    { bar: 'from-green-700 via-green-500 to-green-400', glow: 'rgba(34,197,94,0.5)',  text: 'text-green-400' },
  Explorer:   { bar: 'from-emerald-700 via-emerald-500 to-emerald-300', glow: 'rgba(52,211,153,0.5)', text: 'text-emerald-400' },
  Researcher: { bar: 'from-green-800 via-green-600 to-green-400', glow: 'rgba(22,163,74,0.5)',  text: 'text-green-500' },
  Creator:    { bar: 'from-lime-700 via-lime-500 to-lime-300', glow: 'rgba(163,230,53,0.5)',   text: 'text-lime-400' },
  Collector:  { bar: 'from-teal-700 via-teal-500 to-teal-300', glow: 'rgba(45,212,191,0.5)',   text: 'text-teal-400' },
};

export default function GenomeScoreBar({
  label,
  value,
  icon,
  delay = 0,
  showValue = true,
  size = 'md',
}: GenomeScoreBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => setAnimatedValue(value), delay + 100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [value, delay]);

  const colors = traitColors[label] || traitColors.Builder;

  const heights: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };
  const textSizes: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{icon}</span>
          <span className={`font-mono font-medium ${textSizes[size]} text-white/80`}>{label}</span>
        </div>
        {showValue && (
          <div className="flex items-center gap-1">
            <span className={`font-mono font-bold ${textSizes[size]} ${colors.text}`}>
              {animatedValue}
            </span>
            <span className={`font-mono ${textSizes[size]} text-white/30`}>%</span>
          </div>
        )}
      </div>

      {/* Bar track */}
      <div className={`relative ${heights[size]} bg-white/5 rounded-full overflow-hidden border border-white/5`}>
        {/* Animated fill */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-1000 ease-out`}
          style={{
            width: `${animatedValue}%`,
            boxShadow: `0 0 8px ${colors.glow}, 0 0 16px ${colors.glow}40`,
          }}
        />

        {/* Shimmer sweep */}
        <div
          className="absolute inset-y-0 left-0 rounded-full overflow-hidden transition-all duration-1000 ease-out"
          style={{ width: `${animatedValue}%` }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Tick marks */}
        {[25, 50, 75].map(tick => (
          <div
            key={tick}
            className="absolute top-0 bottom-0 w-px bg-white/10"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>

      {/* Mini scale labels */}
      {size === 'lg' && (
        <div className="flex justify-between mt-1">
          {[0, 25, 50, 75, 100].map(v => (
            <span key={v} className="text-[9px] font-mono text-white/20">{v}</span>
          ))}
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// ── Grouped bar list ──────────────────────────────────────────────────────────
interface GenomeScoreBarsProps {
  scores: {
    builder: number;
    explorer: number;
    researcher: number;
    creator: number;
    collector: number;
  };
  size?: 'sm' | 'md' | 'lg';
}

const TRAIT_META = [
  { key: 'builder',    label: 'Builder',    icon: '⚡' },
  { key: 'explorer',   label: 'Explorer',   icon: '🧭' },
  { key: 'researcher', label: 'Researcher', icon: '🔮' },
  { key: 'creator',    label: 'Creator',    icon: '⚗️' },
  { key: 'collector',  label: 'Collector',  icon: '🛡️' },
] as const;

export function GenomeScoreBars({ scores, size = 'md' }: GenomeScoreBarsProps) {
  return (
    <div className="flex flex-col gap-4">
      {TRAIT_META.map(({ key, label, icon }, i) => (
        <GenomeScoreBar
          key={key}
          label={label}
          icon={icon}
          value={scores[key]}
          delay={i * 120}
          size={size}
        />
      ))}
    </div>
  );
}
