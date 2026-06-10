import React, { useEffect, useRef, useState } from 'react';
import { AppPage } from '../types';

interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
}

const FLOATING_TRAITS = [
  'The Architect', 'The Oracle', 'The Pathfinder',
  'The Alchemist', 'The Guardian', 'The Innovator',
  'Builder 94%', 'Explorer 78%', 'AI Researcher',
  'Genesis Member', 'Protocol Wizard', 'Master Builder',
];

const STATS = [
  { value: '∞', label: 'Unique Genomes' },
  { value: '6', label: 'Archetypes' },
  { value: '12', label: 'Rare Traits' },
  { value: '1979', label: 'Chain ID' },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,197,94,${p.alpha})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34,197,94,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-genome-bg">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Radial glow center */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />

      {/* ── Hero Section ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-16">

        {/* Top badge */}
        <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/25 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono text-green-400 tracking-widest uppercase">
              Ritual Testnet · Chain ID 1979
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>

        {/* Main heading */}
        <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-mono leading-none mb-4">
            <span className="gradient-text glow-text">RITUAL</span>
            <br />
            <span className="text-white/90">AI GENOME</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-lg sm:text-xl text-white/50 font-mono max-w-2xl mx-auto mb-4 leading-relaxed">
            Transform your on-chain activity into a{' '}
            <span className="text-green-400">unique digital DNA</span>.
            <br className="hidden sm:block" />
            Discover your archetype. Evolve your identity.
          </p>
        </div>

        {/* Floating trait pills */}
        <div className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto mb-10">
            {FLOATING_TRAITS.slice(0, 8).map((trait, i) => (
              <span
                key={trait}
                className="trait-badge"
                style={{ animationDelay: `${i * 100}ms`, opacity: 0.6 + (i % 3) * 0.13 }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => onNavigate('mint')}
              className="btn-primary px-8 py-4 rounded-2xl text-base font-mono font-bold flex items-center justify-center gap-3 group"
            >
              <span className="text-xl group-hover:animate-bounce">🧬</span>
              Mint My Genome
              <span className="text-green-300/60 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="btn-secondary px-8 py-4 rounded-2xl text-base font-mono font-medium flex items-center justify-center gap-3"
            >
              <span>🏆</span>
              View Leaderboard
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className={`transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto w-full">
            {STATS.map(({ value, label }) => (
              <div key={label} className="glass rounded-xl p-4 text-center border border-green-500/10 hover:border-green-500/25 transition-all">
                <div className="font-mono font-black text-2xl gradient-text mb-1">{value}</div>
                <div className="text-xs font-mono text-white/40">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-green-500/60 tracking-widest uppercase mb-3">Process</p>
          <h2 className="text-3xl sm:text-4xl font-black font-mono text-white">
            How It <span className="gradient-text">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              icon: '𝕏',
              title: 'Enter X Username',
              desc: 'Provide your X (Twitter) handle. We fetch your profile picture via Unavatar API instantly.',
            },
            {
              step: '02',
              icon: '⬡',
              title: 'Connect Wallet',
              desc: 'Connect MetaMask to Ritual Testnet (Chain ID: 1979). Your wallet address seeds your unique genome.',
            },
            {
              step: '03',
              icon: '🧬',
              title: 'Mint Your Genome',
              desc: 'AI analyzes your data, generates your unique DNA profile, archetype, traits and evolution level.',
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="glass rounded-2xl p-6 border border-green-500/15 hover:border-green-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 text-7xl font-black font-mono text-green-500/5 leading-none select-none">
                {step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center text-2xl mb-4 group-hover:border-green-400/40 transition-all">
                {icon}
              </div>
              <h3 className="font-mono font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Archetypes preview ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-mono text-green-500/60 tracking-widest uppercase mb-3">Archetypes</p>
          <h2 className="text-3xl sm:text-4xl font-black font-mono text-white">
            Who Will <span className="gradient-text">You Be?</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: '⚡', name: 'The Architect', desc: 'Master builder' },
            { icon: '🧭', name: 'The Pathfinder', desc: 'Eternal explorer' },
            { icon: '🔮', name: 'The Oracle', desc: 'Deep researcher' },
            { icon: '⚗️', name: 'The Alchemist', desc: 'Creative force' },
            { icon: '🛡️', name: 'The Guardian', desc: 'Ecosystem protector' },
            { icon: '🌟', name: 'The Innovator', desc: 'Balanced visionary' },
          ].map(({ icon, name, desc }) => (
            <div key={name}
              className="glass rounded-xl p-4 border border-green-500/10 hover:border-green-500/30 transition-all hover:shadow-green-sm cursor-default group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{icon}</div>
              <div className="font-mono font-semibold text-sm text-white mb-0.5">{name}</div>
              <div className="text-xs text-white/40 font-mono">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="relative z-10 text-center pb-24 px-4">
        <div className="glass-bright max-w-2xl mx-auto rounded-3xl p-10 border border-green-500/20"
          style={{ boxShadow: '0 0 60px rgba(34,197,94,0.08)' }}>
          <div className="text-4xl mb-4">🧬</div>
          <h3 className="text-2xl font-black font-mono text-white mb-3">
            Ready to Discover Your <span className="gradient-text">Digital DNA?</span>
          </h3>
          <p className="text-sm text-white/50 font-mono mb-6">
            Every wallet generates a unique genome. No two are alike.
          </p>
          <button
            onClick={() => onNavigate('mint')}
            className="btn-primary px-10 py-4 rounded-2xl text-base font-mono font-bold inline-flex items-center gap-3"
          >
            <span>🧬</span>
            Mint My Genome Now
          </button>
        </div>
      </div>
    </div>
  );
}
