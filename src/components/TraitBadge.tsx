import React from 'react';

interface TraitBadgeProps {
  trait: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  index?: number;
}

const TRAIT_ICONS: Record<string, string> = {
  'Infernet Pioneer':  '🌐',
  'Network Explorer':  '🧭',
  'Master Builder':    '⚡',
  'Ritual Veteran':    '🏆',
  'AI Researcher':     '🔮',
  'DeFi Architect':    '🏗️',
  'Protocol Wizard':   '✨',
  'Chain Navigator':   '⛓️',
  'Genesis Member':    '💎',
  'Alpha Tester':      '🧪',
  'Node Runner':       '🖥️',
  'Smart Contractor':  '📜',
};

const TRAIT_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'Infernet Pioneer':  { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.35)',  text: '#4ade80', glow: '#22c55e' },
  'Network Explorer':  { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)', text: '#6ee7b7', glow: '#34d399' },
  'Master Builder':    { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.35)', text: '#86efac', glow: '#4ade80' },
  'Ritual Veteran':    { bg: 'rgba(163,230,53,0.10)', border: 'rgba(163,230,53,0.30)', text: '#bef264', glow: '#a3e635' },
  'AI Researcher':     { bg: 'rgba(134,239,172,0.10)',border: 'rgba(134,239,172,0.30)',text: '#86efac', glow: '#86efac' },
  'DeFi Architect':    { bg: 'rgba(22,163,74,0.12)',  border: 'rgba(22,163,74,0.35)',  text: '#4ade80', glow: '#16a34a' },
  'Protocol Wizard':   { bg: 'rgba(21,128,61,0.15)',  border: 'rgba(21,128,61,0.40)',  text: '#22c55e', glow: '#15803d' },
  'Chain Navigator':   { bg: 'rgba(20,83,45,0.20)',   border: 'rgba(34,197,94,0.30)',  text: '#4ade80', glow: '#22c55e' },
  'Genesis Member':    { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.45)', text: '#bbf7d0', glow: '#4ade80' },
  'Alpha Tester':      { bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.30)',  text: '#86efac', glow: '#22c55e' },
  'Node Runner':       { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', text: '#6ee7b7', glow: '#10b981' },
  'Smart Contractor':  { bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.30)', text: '#a7f3d0', glow: '#34d399' },
};

const defaultColor = { bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.30)', text: '#4ade80', glow: '#22c55e' };

export default function TraitBadge({ trait, size = 'md', animated = true, index = 0 }: TraitBadgeProps) {
  const icon = TRAIT_ICONS[trait] || '✦';
  const color = TRAIT_COLORS[trait] || defaultColor;

  const paddings = { sm: 'px-2 py-0.5', md: 'px-3 py-1.5', lg: 'px-4 py-2' };
  const fontSizes = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' };
  const iconSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-mono font-medium
        transition-all duration-300 cursor-default select-none
        hover:scale-105
        ${paddings[size]} ${fontSizes[size]}
        ${animated ? 'animate-fade-in' : ''}
      `}
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
        animationDelay: `${index * 80}ms`,
        animationFillMode: 'both',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${color.glow}40`;
        (e.currentTarget as HTMLElement).style.borderColor = color.border.replace('0.3', '0.6').replace('0.35', '0.65');
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.borderColor = color.border;
      }}
    >
      <span className={iconSizes[size]}>{icon}</span>
      <span>{trait}</span>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}

// ── Grouped trait list ────────────────────────────────────────────────────────
interface TraitBadgeListProps {
  traits: string[];
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function TraitBadgeList({ traits, size = 'md', animated = true }: TraitBadgeListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {traits.map((trait, i) => (
        <TraitBadge key={trait} trait={trait} size={size} animated={animated} index={i} />
      ))}
    </div>
  );
}
