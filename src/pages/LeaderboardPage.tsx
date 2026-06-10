import React, { useEffect, useState } from 'react';
import { AppPage, LeaderboardEntry, GenomeScores } from '../types';
import { ARCHETYPES } from '../lib/genome';
import { getLeaderboard } from '../lib/supabase';

interface LeaderboardPageProps {
  onNavigate: (page: AppPage) => void;
}

type Category = 'overall' | 'builder' | 'explorer' | 'researcher' | 'creator';

const CATEGORIES: { id: Category; label: string; icon: string; key: keyof GenomeScores | 'xp_score' }[] = [
  { id: 'overall',    label: 'Overall',    icon: '🏆', key: 'xp_score'   },
  { id: 'builder',    label: 'Builders',   icon: '⚡', key: 'builder'    },
  { id: 'explorer',   label: 'Explorers',  icon: '🧭', key: 'explorer'   },
  { id: 'researcher', label: 'Researchers',icon: '🔮', key: 'researcher' },
  { id: 'creator',    label: 'Creators',   icon: '⚗️', key: 'creator'    },
];

function getRankStyle(rank: number) {
  if (rank === 1) return { border: '#ffd700', bg: 'rgba(255,215,0,0.08)', glow: '0 0 20px rgba(255,215,0,0.2)', medal: '🥇' };
  if (rank === 2) return { border: '#c0c0c0', bg: 'rgba(192,192,192,0.06)', glow: '0 0 15px rgba(192,192,192,0.15)', medal: '🥈' };
  if (rank === 3) return { border: '#cd7f32', bg: 'rgba(205,127,50,0.06)', glow: '0 0 15px rgba(205,127,50,0.15)', medal: '🥉' };
  return { border: 'rgba(34,197,94,0.15)', bg: 'transparent', glow: 'none', medal: `#${rank}` };
}

function getScore(entry: LeaderboardEntry, key: keyof GenomeScores | 'xp_score'): number {
  if (key === 'xp_score') return entry.xp_score;
  return entry.genome_scores[key as keyof GenomeScores] ?? 0;
}

export default function LeaderboardPage({ onNavigate }: LeaderboardPageProps) {
  const [category, setCategory] = useState<Category>('overall');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(30).then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const activeKey = CATEGORIES.find(c => c.id === category)!.key;

  const sorted = [...entries].sort((a, b) => getScore(b, activeKey) - getScore(a, activeKey));

  return (
    <div className="min-h-screen bg-genome-bg grid-overlay pt-16">
      <div className="scan-line" />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-green-500/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Live Rankings</span>
          </div>
          <h1 className="font-mono font-black text-white text-3xl sm:text-4xl mb-2">
            Genome <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-sm font-mono text-white/40">
            Top genomes across the Ritual ecosystem
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-medium transition-all duration-200 ${
                category === cat.id
                  ? 'bg-green-500/15 text-green-400 border border-green-500/30 shadow-green-sm'
                  : 'glass text-white/40 border border-green-500/10 hover:text-white/70 hover:border-green-500/20'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-green-500/30 border-t-green-400 animate-spin" />
            <p className="font-mono text-sm text-white/30">Fetching genome data...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && entries.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🧬</div>
            <p className="font-mono text-white/40 mb-6">No genomes minted yet. Be the first!</p>
            <button onClick={() => onNavigate('mint')} className="btn-primary px-6 py-3 rounded-xl font-mono font-semibold text-sm">
              Mint My Genome →
            </button>
          </div>
        )}

        {/* Leaderboard list */}
        {!loading && sorted.length > 0 && (
          <div className="space-y-3">
            {sorted.map((entry, idx) => {
              const rank = idx + 1;
              const rankStyle = getRankStyle(rank);
              const archetype = ARCHETYPES[entry.archetype as keyof typeof ARCHETYPES] || ARCHETYPES['The Innovator'];
              const score = getScore(entry, activeKey);
              const scoreLabel = activeKey === 'xp_score' ? `${score.toLocaleString()} XP` : `${score}%`;

              return (
                <div
                  key={entry.twitter_username}
                  className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    border: `1px solid ${rankStyle.border}`,
                    background: rankStyle.bg,
                    boxShadow: rankStyle.glow,
                  }}
                >
                  {/* Subtle glow bg */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 40% 80% at 0% 50%, ${archetype.color}05, transparent)` }} />

                  <div className="relative z-10 flex items-center gap-4 p-4">

                    {/* Rank */}
                    <div className="w-10 text-center flex-shrink-0">
                      {rank <= 3 ? (
                        <span className="text-2xl">{rankStyle.medal}</span>
                      ) : (
                        <span className="font-mono font-black text-white/30 text-lg">{rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={entry.avatar_url}
                        alt={entry.twitter_username}
                        className="w-12 h-12 rounded-xl object-cover"
                        style={{ border: `2px solid ${archetype.color}40` }}
                        onError={e => {
                          (e.currentTarget as HTMLImageElement).src =
                            `https://api.dicebear.com/7.x/identicon/svg?seed=${entry.twitter_username}`;
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 text-sm">{archetype.icon}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-white text-sm truncate">
                          @{entry.twitter_username}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-mono hidden sm:inline-flex"
                          style={{ background: `${archetype.color}15`, color: archetype.color, border: `1px solid ${archetype.color}30` }}
                        >
                          {entry.archetype}
                        </span>
                      </div>

                      {/* Mini score bars — desktop only */}
                      <div className="hidden sm:flex gap-3 mt-1.5">
                        {Object.entries(entry.genome_scores).map(([trait, val]) => (
                          <div key={trait} className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-white/25 capitalize w-12 truncate">{trait}</span>
                            <div className="w-16 h-1 bg-green-500/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-green-700 to-green-400"
                                style={{ width: `${val}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-white/30">{val}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Score + Level */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono font-black text-lg" style={{ color: archetype.color }}>
                        {scoreLabel}
                      </div>
                      <div className="text-xs font-mono text-white/30">
                        LVL {entry.evolution_level}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="flex gap-3 mt-10 justify-center">
          <button onClick={() => onNavigate('mint')} className="btn-primary px-6 py-3 rounded-xl font-mono font-semibold text-sm">
            🧬 Mint My Genome
          </button>
          <button onClick={() => onNavigate('compare')} className="btn-secondary px-5 py-3 rounded-xl font-mono text-sm">
            ⚖ Compare
          </button>
        </div>
      </div>
    </div>
  );
}
