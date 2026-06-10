import React, { useState } from 'react';
import { Genome, AppPage } from '../types';
import { ARCHETYPES } from '../lib/genome';
import DNAVisualization from '../components/DNAVisualization';
import { GenomeScoreBars } from '../components/GenomeScoreBar';
import ArchetypeCard from '../components/ArchetypeCard';
import { TraitBadgeList } from '../components/TraitBadge';
import GenomeCard from '../components/GenomeCard';

interface DashboardPageProps {
  genome: Genome | null;
  onNavigate: (page: AppPage) => void;
}

type Tab = 'overview' | 'insights' | 'card';

export default function DashboardPage({ genome, onNavigate }: DashboardPageProps) {
  const [tab, setTab] = useState<Tab>('overview');

  if (!genome) {
    return (
      <div className="min-h-screen bg-genome-bg flex items-center justify-center px-4 pt-16">
        <div className="text-center">
          <div className="text-5xl mb-4">🧬</div>
          <h2 className="font-mono font-bold text-white text-xl mb-3">No Genome Found</h2>
          <p className="text-sm text-white/40 font-mono mb-6">Mint your genome first to see your dashboard.</p>
          <button onClick={() => onNavigate('mint')} className="btn-primary px-6 py-3 rounded-xl font-mono font-semibold text-sm">
            Mint My Genome →
          </button>
        </div>
      </div>
    );
  }

  const archetype = ARCHETYPES[genome.archetype as keyof typeof ARCHETYPES] || ARCHETYPES['The Innovator'];
  const shortWallet = `${genome.wallet_address.slice(0, 6)}...${genome.wallet_address.slice(-4)}`;
  const dominantEntry = Object.entries(genome.genome_scores).sort((a, b) => b[1] - a[1])[0];

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'insights', label: 'AI Insights', icon: '🔮' },
    { id: 'card', label: 'Share Card', icon: '🧬' },
  ];

  return (
    <div className="min-h-screen bg-genome-bg grid-overlay pt-16">
      <div className="scan-line" />

      {/* Top glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 50% 30% at 50% 0%, ${archetype.color}08 0%, transparent 60%)` }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* ── Profile Header ── */}
        <div className="glass-bright rounded-2xl border border-green-500/20 p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 40% 80% at 0% 50%, ${archetype.color}06, transparent)` }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden"
                style={{ border: `2px solid ${archetype.color}50` }}>
                <img
                  src={genome.avatar_url}
                  alt={genome.twitter_username}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src =
                      `https://api.dicebear.com/7.x/identicon/svg?seed=${genome.wallet_address}`;
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-genome-bg flex items-center justify-center"
                style={{ background: archetype.color }}>
                <span className="text-[10px]">{archetype.icon}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-mono font-black text-white text-2xl">@{genome.twitter_username}</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono"
                  style={{ background: `${archetype.color}20`, color: archetype.color, border: `1px solid ${archetype.color}35` }}>
                  {genome.archetype}
                </span>
              </div>
              <p className="text-sm font-mono text-white/40 mb-3">{shortWallet} · Ritual Testnet</p>
              <TraitBadgeList traits={genome.traits} size="sm" />
            </div>

            {/* Stats */}
            <div className="flex sm:flex-col gap-4 sm:gap-3 flex-shrink-0">
              {[
                { label: 'Level', value: `LVL ${genome.evolution_level}`, icon: '⬆' },
                { label: 'XP', value: genome.xp_score.toLocaleString(), icon: '⚡' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="text-center glass rounded-xl px-4 py-2 border border-green-500/10">
                  <div className="text-xs font-mono text-white/30 flex items-center gap-1 justify-center mb-0.5">
                    <span style={{ color: archetype.color }}>{icon}</span>{label}
                  </div>
                  <div className="font-mono font-bold text-white text-sm">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-6 glass rounded-xl p-1 border border-green-500/10 w-fit">
          {tabs.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-200 ${
                tab === id
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                  : 'text-white/40 hover:text-white/70'
              }`}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — DNA */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="glass rounded-2xl border border-green-500/15 p-6">
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">DNA Visualization</p>
                <div className="flex justify-center">
                  <DNAVisualization scores={genome.genome_scores} size={260} />
                </div>
              </div>

              {/* Dominant trait */}
              <div className="glass rounded-2xl border border-green-500/15 p-5">
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Dominant Trait</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${archetype.color}15`, border: `1px solid ${archetype.color}30` }}>
                    {archetype.icon}
                  </div>
                  <div>
                    <p className="font-mono font-bold text-white capitalize">{dominantEntry[0]}</p>
                    <p className="text-2xl font-black font-mono" style={{ color: archetype.color }}>
                      {dominantEntry[1]}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle — Scores */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="glass rounded-2xl border border-green-500/15 p-6">
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-5">Genome Breakdown</p>
                <GenomeScoreBars scores={genome.genome_scores} size="lg" />
              </div>
            </div>

            {/* Right — Archetype + Traits */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <ArchetypeCard archetypeName={genome.archetype} />

              <div className="glass rounded-2xl border border-green-500/15 p-5">
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Unlocked Traits</p>
                <TraitBadgeList traits={genome.traits} size="md" />
              </div>

              {/* Evolution bar */}
              <div className="glass rounded-2xl border border-green-500/15 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-mono text-white/30 uppercase tracking-widest">Evolution Progress</p>
                  <span className="text-xs font-mono" style={{ color: archetype.color }}>
                    LVL {genome.evolution_level} / 10
                  </span>
                </div>
                <div className="genome-bar mb-2">
                  <div className="genome-bar-fill" style={{ width: `${genome.evolution_level * 10}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-mono text-white/25">XP: {genome.xp_score.toLocaleString()}</span>
                  <span className="text-xs font-mono text-white/25">Next: {((genome.evolution_level) * 1000).toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── AI Insights Tab ── */}
        {tab === 'insights' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: '🧬',
                title: 'AI Summary',
                content: genome.ai_summary,
                color: archetype.color,
              },
              {
                icon: '⚡',
                title: 'Strength Analysis',
                content: genome.strength_analysis,
                color: '#4ade80',
              },
              {
                icon: '🌱',
                title: 'Growth Opportunities',
                content: genome.growth_opportunities,
                color: '#86efac',
              },
              {
                icon: '🌐',
                title: 'Participation Insights',
                content: genome.participation_insights,
                color: '#22c55e',
              },
            ].map(({ icon, title, content, color }) => (
              <div key={title}
                className="glass rounded-2xl border border-green-500/15 p-6 hover:border-green-500/25 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 100% 0%, ${color}08, transparent 70%)` }} />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    {icon}
                  </div>
                  <h3 className="font-mono font-bold text-white text-sm">{title}</h3>
                </div>
                <p className="text-sm text-white/60 leading-relaxed font-mono">{content}</p>
              </div>
            ))}

            {/* Archetype strengths */}
            <div className="glass rounded-2xl border border-green-500/15 p-6 sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${archetype.color}15`, border: `1px solid ${archetype.color}25` }}>
                  {archetype.icon}
                </div>
                <h3 className="font-mono font-bold text-white text-sm">Archetype Strengths — {genome.archetype}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {genome.archetype_strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl"
                    style={{ background: `${archetype.color}08`, border: `1px solid ${archetype.color}20` }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: archetype.color }} />
                    <span className="text-xs font-mono text-white/70">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Share Card Tab ── */}
        {tab === 'card' && (
          <div className="max-w-sm mx-auto">
            <GenomeCard genome={genome} showShareButtons />
          </div>
        )}

        {/* Bottom nav */}
        <div className="flex gap-3 mt-8 justify-center">
          <button onClick={() => onNavigate('compare')}
            className="btn-secondary px-5 py-2.5 rounded-xl font-mono text-sm flex items-center gap-2">
            ⚖ Compare Genomes
          </button>
          <button onClick={() => onNavigate('leaderboard')}
            className="btn-secondary px-5 py-2.5 rounded-xl font-mono text-sm flex items-center gap-2">
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
