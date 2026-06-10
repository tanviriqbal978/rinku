import React, { useRef } from 'react';
import { Genome } from '../types';
import { TraitBadgeList } from './TraitBadge';
import { ARCHETYPES } from '../lib/genome';

interface GenomeCardProps {
  genome: Genome;
  showShareButtons?: boolean;
}

export default function GenomeCard({ genome, showShareButtons = true }: GenomeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const archetype = ARCHETYPES[genome.archetype as keyof typeof ARCHETYPES] || ARCHETYPES['The Innovator'];

  const dominantTrait = Object.entries(genome.genome_scores)
    .sort((a, b) => b[1] - a[1])[0];

  const handleShareX = () => {
    const text = `🧬 My Ritual AI Genome is live!\n\nArchetype: ${genome.archetype}\nEvolution Level: ${genome.evolution_level}\nXP: ${genome.xp_score}\n\nDiscover your digital DNA on Ritual Network 👇`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareDiscord = () => {
    const text = `🧬 **${genome.twitter_username}'s Ritual AI Genome**\nArchetype: **${genome.archetype}**\nEvolution Level: **${genome.evolution_level}** | XP: **${genome.xp_score}**\nTraits: ${genome.traits.join(', ')}`;
    navigator.clipboard.writeText(text).then(() => alert('Copied for Discord!'));
  };

  const shortWallet = `${genome.wallet_address.slice(0, 6)}...${genome.wallet_address.slice(-4)}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Card */}
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #050f0a 0%, #0a1a10 50%, #071209 100%)',
          border: `1px solid ${archetype.color}30`,
          boxShadow: `0 0 40px ${archetype.color}15, inset 0 0 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />

        {/* Top glow bar */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${archetype.color}80, transparent)` }}
        />

        {/* Corner brackets */}
        {[
          'top-3 left-3 border-t border-l',
          'top-3 right-3 border-t border-r',
          'bottom-3 left-3 border-b border-l',
          'bottom-3 right-3 border-b border-r',
        ].map((cls, i) => (
          <div key={i} className={`absolute w-5 h-5 ${cls} border-green-500/40`} />
        ))}

        {/* Header */}
        <div className="relative z-10 px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-xl overflow-hidden"
                style={{ border: `2px solid ${archetype.color}50` }}
              >
                {genome.avatar_url ? (
                  <img
                    src={genome.avatar_url}
                    alt={genome.twitter_username}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${genome.wallet_address}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl"
                    style={{ background: `${archetype.color}15` }}>
                    🧬
                  </div>
                )}
              </div>
              {/* Online dot */}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-genome-bg flex items-center justify-center"
                style={{ background: archetype.color }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Identity info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-white text-lg leading-tight truncate">
                  @{genome.twitter_username}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                  style={{ background: `${archetype.color}20`, color: archetype.color, border: `1px solid ${archetype.color}30` }}>
                  Verified
                </span>
              </div>
              <p className="text-xs font-mono text-white/40 mb-2">{shortWallet}</p>

              {/* Archetype pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ background: `${archetype.color}15`, border: `1px solid ${archetype.color}30` }}>
                <span className="text-sm">{archetype.icon}</span>
                <span className="text-xs font-mono font-semibold" style={{ color: archetype.color }}>
                  {genome.archetype}
                </span>
              </div>
            </div>

            {/* Ritual logo mark */}
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-mono font-bold text-green-500/30">🧬</div>
              <div className="text-[9px] font-mono text-white/20 tracking-widest">RITUAL</div>
              <div className="text-[9px] font-mono text-white/20 tracking-widest">GENOME</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${archetype.color}30, transparent)` }} />

        {/* Stats row */}
        <div className="relative z-10 px-6 py-4 grid grid-cols-3 gap-4">
          {[
            { label: 'Evolution', value: `LVL ${genome.evolution_level}`, icon: '⬆' },
            { label: 'XP Score',  value: genome.xp_score.toLocaleString(), icon: '⚡' },
            { label: 'Dominance', value: `${dominantTrait[1]}%`, icon: '◈' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="text-center">
              <div className="text-xs font-mono text-white/30 mb-1 flex items-center justify-center gap-1">
                <span className="text-green-500/60">{icon}</span>
                <span>{label}</span>
              </div>
              <div className="font-mono font-bold text-white text-sm">{value}</div>
            </div>
          ))}
        </div>

        {/* Genome score mini bars */}
        <div className="relative z-10 px-6 pb-4">
          <div className="grid grid-cols-5 gap-1.5">
            {Object.entries(genome.genome_scores).map(([key, val]) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="w-full h-16 rounded-lg overflow-hidden flex flex-col-reverse"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div
                    className="w-full rounded-b-lg transition-all duration-1000"
                    style={{
                      height: `${val}%`,
                      background: `linear-gradient(180deg, ${archetype.color}99, ${archetype.color}40)`,
                      boxShadow: `0 0 8px ${archetype.color}30`,
                    }}
                  />
                </div>
                <span className="text-[9px] font-mono text-white/30 capitalize">{key.slice(0, 3)}</span>
                <span className="text-[9px] font-mono font-bold" style={{ color: archetype.color }}>{val}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traits */}
        {genome.traits.length > 0 && (
          <div className="relative z-10 px-6 pb-5">
            <div className="mb-2">
              <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Unlocked Traits</span>
            </div>
            <TraitBadgeList traits={genome.traits} size="sm" animated={false} />
          </div>
        )}

        {/* AI summary footer */}
        <div className="relative z-10 mx-6 mb-5 p-3 rounded-xl"
          style={{ background: `${archetype.color}08`, border: `1px solid ${archetype.color}15` }}>
          <p className="text-[11px] font-mono text-white/50 leading-relaxed italic line-clamp-2">
            "{genome.ai_summary}"
          </p>
        </div>

        {/* Bottom watermark */}
        <div className="relative z-10 px-6 pb-4 flex items-center justify-between">
          <span className="text-[9px] font-mono text-white/15 tracking-widest">RITUAL TESTNET · CHAIN ID 1979</span>
          <span className="text-[9px] font-mono text-white/15 tracking-widest">AI GENOME v1.0</span>
        </div>

        {/* Bottom glow bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${archetype.color}40, transparent)` }}
        />
      </div>

      {/* Share buttons */}
      {showShareButtons && (
        <div className="flex gap-3">
          <button
            onClick={handleShareX}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >
            <span className="text-base">𝕏</span>
            Share on X
          </button>
          <button
            onClick={handleShareDiscord}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: 'rgba(88,101,242,0.10)',
              border: '1px solid rgba(88,101,242,0.25)',
              color: 'rgba(148,155,255,0.9)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(88,101,242,0.16)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(88,101,242,0.10)')}
          >
            <span className="text-base">💬</span>
            Copy for Discord
          </button>
        </div>
      )}
    </div>
  );
}
