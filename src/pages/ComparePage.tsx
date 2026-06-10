import React, { useState } from 'react';
import { AppPage, Genome } from '../types';
import { getGenomeByUsername } from '../lib/supabase';
import { ARCHETYPES } from '../lib/genome';
import { TraitBadgeList } from '../components/TraitBadge';
import { GenomeScoreBars } from '../components/GenomeScoreBar';

interface ComparePageProps {
  currentGenome: Genome | null;
  onNavigate: (page: AppPage) => void;
}

function calcCompatibility(a: Genome, b: Genome): number {
  const keys: (keyof typeof a.genome_scores)[] = ['builder', 'explorer', 'researcher', 'creator', 'collector'];
  const diff = keys.reduce((sum, k) => sum + Math.abs(a.genome_scores[k] - b.genome_scores[k]), 0);
  return Math.max(0, Math.round(100 - diff / 2));
}

function getSharedTraits(a: Genome, b: Genome): string[] {
  return a.traits.filter(t => b.traits.includes(t));
}

function DiffBar({ labelA, labelB, valA, valB }: { labelA: string; labelB: string; valA: number; valB: number }) {
  const maxVal = Math.max(valA, valB, 1);
  const aWin = valA >= valB;

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Left score */}
      <div className={`w-10 text-right font-mono font-bold text-sm ${aWin ? 'text-green-400' : 'text-white/40'}`}>
        {valA}%
      </div>

      {/* Bar */}
      <div className="flex-1 flex items-center gap-1 h-3">
        {/* A bar — grows left to right from center */}
        <div className="flex-1 flex justify-end">
          <div
            className={`h-3 rounded-l-full transition-all duration-1000 ${aWin ? 'bg-gradient-to-l from-green-500 to-green-700' : 'bg-gradient-to-l from-green-800 to-green-900'}`}
            style={{ width: `${(valA / maxVal) * 100}%` }}
          />
        </div>
        {/* Center label */}
        <div className="w-20 text-center text-[10px] font-mono text-white/30 capitalize flex-shrink-0">{labelA}</div>
        {/* B bar — grows right */}
        <div className="flex-1 flex justify-start">
          <div
            className={`h-3 rounded-r-full transition-all duration-1000 ${!aWin ? 'bg-gradient-to-r from-emerald-500 to-emerald-700' : 'bg-gradient-to-r from-emerald-900 to-emerald-800'}`}
            style={{ width: `${(valB / maxVal) * 100}%` }}
          />
        </div>
      </div>

      {/* Right score */}
      <div className={`w-10 text-left font-mono font-bold text-sm ${!aWin ? 'text-emerald-400' : 'text-white/40'}`}>
        {valB}%
      </div>
    </div>
  );
}

function MiniProfile({ genome, side }: { genome: Genome; side: 'left' | 'right' }) {
  const archetype = ARCHETYPES[genome.archetype as keyof typeof ARCHETYPES] || ARCHETYPES['The Innovator'];
  const isRight = side === 'right';

  return (
    <div className={`flex flex-col items-center gap-3 text-center ${isRight ? '' : ''}`}>
      <div className="relative">
        <img
          src={genome.avatar_url}
          alt={genome.twitter_username}
          className="w-16 h-16 rounded-2xl object-cover"
          style={{ border: `2px solid ${archetype.color}50` }}
          onError={e => {
            (e.currentTarget as HTMLImageElement).src =
              `https://api.dicebear.com/7.x/identicon/svg?seed=${genome.wallet_address}`;
          }}
        />
        <span className="absolute -bottom-1 -right-1 text-base">{archetype.icon}</span>
      </div>
      <div>
        <p className="font-mono font-bold text-white text-sm">@{genome.twitter_username}</p>
        <p className="text-xs font-mono mt-0.5" style={{ color: archetype.color }}>{genome.archetype}</p>
      </div>
      <div className="flex gap-3 text-center">
        {[
          { label: 'LVL', val: genome.evolution_level },
          { label: 'XP', val: genome.xp_score.toLocaleString() },
        ].map(({ label, val }) => (
          <div key={label} className="glass rounded-xl px-3 py-1.5 border border-green-500/10">
            <div className="text-[10px] font-mono text-white/30">{label}</div>
            <div className="font-mono font-bold text-white text-xs">{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparePage({ currentGenome, onNavigate }: ComparePageProps) {
  const [searchUsername, setSearchUsername] = useState('');
  const [compareGenome, setCompareGenome] = useState<Genome | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!searchUsername.trim()) return;
    setSearching(true);
    setNotFound(false);
    setCompareGenome(null);

    const clean = searchUsername.replace('@', '').trim();
    const result = await getGenomeByUsername(clean);

    if (result) {
      setCompareGenome(result);
    } else {
      setNotFound(true);
    }
    setSearching(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const compatibility = currentGenome && compareGenome
    ? calcCompatibility(currentGenome, compareGenome)
    : null;

  const sharedTraits = currentGenome && compareGenome
    ? getSharedTraits(currentGenome, compareGenome)
    : [];

  const scoreKeys = ['builder', 'explorer', 'researcher', 'creator', 'collector'] as const;

  return (
    <div className="min-h-screen bg-genome-bg grid-overlay pt-16">
      <div className="scan-line" />

      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(34,197,94,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-green-500/20 mb-4">
            <span className="text-xs font-mono text-green-400 uppercase tracking-widest">⚖ Genome Comparison</span>
          </div>
          <h1 className="font-mono font-black text-white text-3xl sm:text-4xl mb-2">
            Compare <span className="gradient-text">Genomes</span>
          </h1>
          <p className="text-sm font-mono text-white/40">Enter any X username to compare genomes</p>
        </div>

        {/* No current genome */}
        {!currentGenome && (
          <div className="text-center py-16 glass rounded-2xl border border-green-500/15">
            <div className="text-5xl mb-4">🧬</div>
            <h2 className="font-mono font-bold text-white text-xl mb-3">You need a genome first</h2>
            <p className="text-sm text-white/40 font-mono mb-6">Mint your genome to compare with others.</p>
            <button onClick={() => onNavigate('mint')} className="btn-primary px-6 py-3 rounded-xl font-mono font-semibold text-sm">
              Mint My Genome →
            </button>
          </div>
        )}

        {currentGenome && (
          <>
            {/* Search bar */}
            <div className="flex gap-3 mb-8 max-w-md mx-auto">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/60 font-mono text-sm">@</span>
                <input
                  type="text"
                  className="input-genome pl-8"
                  placeholder="Search X username..."
                  value={searchUsername}
                  onChange={e => setSearchUsername(e.target.value)}
                  onKeyDown={handleKey}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching || !searchUsername.trim()}
                className="btn-primary px-5 py-2.5 rounded-xl font-mono font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {searching ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ...
                  </span>
                ) : 'Compare'}
              </button>
            </div>

            {/* Not found */}
            {notFound && (
              <div className="text-center py-8 glass rounded-2xl border border-red-500/15 mb-8">
                <p className="font-mono text-white/50 text-sm">
                  No genome found for <span className="text-green-400">@{searchUsername}</span>. They haven't minted yet.
                </p>
              </div>
            )}

            {/* Comparison layout */}
            {compareGenome && (
              <div className="space-y-6">

                {/* Side by side profiles */}
                <div className="glass rounded-2xl border border-green-500/15 p-6">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <MiniProfile genome={currentGenome} side="left" />

                    {/* Compatibility meter */}
                    <div className="text-center">
                      <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Compatibility</p>
                      <div className="relative w-20 h-20 mx-auto mb-2">
                        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="6" />
                          <circle
                            cx="40" cy="40" r="32"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - compatibility! / 100)}`}
                            style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.6))', transition: 'stroke-dashoffset 1.5s ease' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-mono font-black text-green-400 text-lg">{compatibility}%</span>
                        </div>
                      </div>
                      <p className="text-[11px] font-mono text-white/30">
                        {compatibility! >= 75 ? 'High Synergy' : compatibility! >= 50 ? 'Compatible' : 'Contrasting'}
                      </p>
                    </div>

                    <MiniProfile genome={compareGenome} side="right" />
                  </div>
                </div>

                {/* Head to head genome bars */}
                <div className="glass rounded-2xl border border-green-500/15 p-6">
                  <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-5 text-center">
                    Head-to-Head Genome Comparison
                  </p>

                  {/* Column headers */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 text-right text-xs font-mono text-green-400/70">@{currentGenome.twitter_username.slice(0, 8)}</div>
                    <div className="flex-1" />
                    <div className="w-20" />
                    <div className="flex-1" />
                    <div className="w-10 text-left text-xs font-mono text-emerald-400/70">@{compareGenome.twitter_username.slice(0, 8)}</div>
                  </div>

                  <div className="divide-y divide-green-500/5">
                    {scoreKeys.map(key => (
                      <DiffBar
                        key={key}
                        labelA={key}
                        labelB={key}
                        valA={currentGenome.genome_scores[key]}
                        valB={compareGenome.genome_scores[key]}
                      />
                    ))}
                  </div>
                </div>

                {/* Shared traits + differences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Shared traits */}
                  <div className="glass rounded-2xl border border-green-500/15 p-5">
                    <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
                      Shared Traits ({sharedTraits.length})
                    </p>
                    {sharedTraits.length > 0 ? (
                      <TraitBadgeList traits={sharedTraits} size="md" />
                    ) : (
                      <p className="text-sm font-mono text-white/25 italic">No shared traits — truly unique genomes!</p>
                    )}
                  </div>

                  {/* Archetype comparison */}
                  <div className="glass rounded-2xl border border-green-500/15 p-5">
                    <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">Archetypes</p>

                    {[
                      { genome: currentGenome, label: 'You' },
                      { genome: compareGenome, label: 'Them' },
                    ].map(({ genome, label }) => {
                      const arch = ARCHETYPES[genome.archetype as keyof typeof ARCHETYPES] || ARCHETYPES['The Innovator'];
                      return (
                        <div key={label} className="flex items-center gap-3 mb-4 last:mb-0">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                            style={{ background: `${arch.color}15`, border: `1px solid ${arch.color}30` }}
                          >
                            {arch.icon}
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-white/30">{label}</p>
                            <p className="font-mono font-bold text-sm" style={{ color: arch.color }}>{genome.archetype}</p>
                          </div>
                        </div>
                      );
                    })}

                    {currentGenome.archetype === compareGenome.archetype && (
                      <div className="mt-3 px-3 py-2 rounded-xl text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20">
                        ✦ Same archetype — rare twin genomes!
                      </div>
                    )}
                  </div>
                </div>

                {/* Dominant traits comparison */}
                <div className="glass rounded-2xl border border-green-500/15 p-5">
                  <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">Full Trait Sets</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-mono text-green-400 mb-2">@{currentGenome.twitter_username}</p>
                      <TraitBadgeList traits={currentGenome.traits} size="sm" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-emerald-400 mb-2">@{compareGenome.twitter_username}</p>
                      <TraitBadgeList traits={compareGenome.traits} size="sm" />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* No search yet — placeholder */}
            {!compareGenome && !notFound && (
              <div className="text-center py-16 glass rounded-2xl border border-green-500/10 border-dashed">
                <div className="text-5xl mb-4 opacity-30">⚖</div>
                <p className="font-mono text-white/25 text-sm">Search a username above to compare genomes</p>
              </div>
            )}
          </>
        )}

        {/* Bottom nav */}
        <div className="flex gap-3 mt-8 justify-center">
          <button onClick={() => onNavigate('dashboard')} className="btn-secondary px-5 py-2.5 rounded-xl font-mono text-sm">
            ← My Dashboard
          </button>
          <button onClick={() => onNavigate('leaderboard')} className="btn-secondary px-5 py-2.5 rounded-xl font-mono text-sm">
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
