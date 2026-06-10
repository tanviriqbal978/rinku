import React, { useState, useEffect } from 'react';
import { AppPage, Genome } from '../types';
import { useWallet } from '../hooks/useWallet';
import { generateGenomeScores, generateEvolutionLevel, generateXP, determineArchetype, generateTraits, ARCHETYPES } from '../lib/genome';
import { generateAIInsights } from '../lib/groq';
import { saveGenome, getGenomeByWallet } from '../lib/supabase';

interface MintPageProps {
  onNavigate: (page: AppPage) => void;
  onGenomeMinted: (genome: Genome) => void;
}

type Step = 'username' | 'wallet' | 'generating' | 'done';

export default function MintPage({ onNavigate, onGenomeMinted }: MintPageProps) {
  const { address, isConnecting, isConnected, connect } = useWallet();
  const [step, setStep] = useState<Step>('username');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState('');
  const [existingGenome, setExistingGenome] = useState<Genome | null>(null);

  // When wallet connects, move to generating
  useEffect(() => {
    if (isConnected && address && step === 'wallet') {
      checkExistingAndGenerate(address);
    }
  }, [isConnected, address]);

  // Avatar URL via Unavatar
  const getAvatarUrl = (handle: string) =>
    `https://unavatar.io/twitter/${handle.replace('@', '')}`;

  const handleUsernameSubmit = () => {
    const clean = username.trim().replace('@', '');
    if (!clean || clean.length < 1) {
      setUsernameError('Please enter a valid X username');
      return;
    }
    setUsernameError('');
    const url = getAvatarUrl(clean);
    setAvatarUrl(url);
    setUsername(clean);
    setStep('wallet');
  };

  const checkExistingAndGenerate = async (walletAddr: string) => {
    const existing = await getGenomeByWallet(walletAddr);
    if (existing) {
      setExistingGenome(existing);
      setStep('done');
      onGenomeMinted(existing);
      return;
    }
    await generateAndSave(walletAddr);
  };

  const generateAndSave = async (walletAddr: string) => {
    setStep('generating');
    setGenProgress(0);

    const steps = [
      { msg: 'Scanning wallet activity...', pct: 15 },
      { msg: 'Computing genome scores...', pct: 35 },
      { msg: 'Determining archetype...', pct: 55 },
      { msg: 'Unlocking traits...', pct: 70 },
      { msg: 'Generating AI insights...', pct: 85 },
      { msg: 'Saving genome to network...', pct: 95 },
    ];

    for (const s of steps) {
      setGenStatus(s.msg);
      setGenProgress(s.pct);
      await new Promise(r => setTimeout(r, 600));
    }

    const scores = generateGenomeScores(walletAddr, username);
    const archetypeName = determineArchetype(scores);
    const archetype = ARCHETYPES[archetypeName];
    const traits = generateTraits(walletAddr, scores);
    const evolutionLevel = generateEvolutionLevel(walletAddr);
    const xpScore = generateXP(walletAddr);

    setGenStatus('Calling AI engine...');
    const insights = await generateAIInsights(username, scores, archetypeName, traits);

    const genome: Genome = {
      wallet_address: walletAddr,
      twitter_username: username,
      avatar_url: avatarUrl,
      archetype: archetypeName,
      archetype_description: archetype.description,
      archetype_strengths: archetype.strengths,
      genome_scores: scores,
      traits,
      ai_summary: insights.ai_summary,
      strength_analysis: insights.strength_analysis,
      growth_opportunities: insights.growth_opportunities,
      participation_insights: insights.participation_insights,
      evolution_level: evolutionLevel,
      xp_score: xpScore,
    };

    setGenStatus('Saving to Supabase...');
    setGenProgress(98);
    const saved = await saveGenome(genome);

    setGenProgress(100);
    setGenStatus('Genome minted! ✓');
    await new Promise(r => setTimeout(r, 600));

    setStep('done');
    onGenomeMinted(saved || genome);
  };

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="min-h-screen bg-genome-bg grid-overlay flex items-center justify-center px-4 pt-16">
      <div className="scan-line" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🧬</div>
          <h1 className="text-3xl font-black font-mono text-white mb-2">
            Mint Your <span className="gradient-text">Genome</span>
          </h1>
          <p className="text-sm text-white/40 font-mono">
            Generate your unique AI-powered digital DNA
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {(['username', 'wallet', 'generating', 'done'] as Step[]).map((s, i) => {
            const stepIdx = ['username', 'wallet', 'generating', 'done'].indexOf(step);
            const thisIdx = i;
            const isDone = thisIdx < stepIdx;
            const isActive = s === step;
            return (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all duration-300 ${
                  isDone ? 'bg-green-500 border-green-500 text-white' :
                  isActive ? 'bg-green-500/20 border-green-400 text-green-400' :
                  'bg-transparent border-white/10 text-white/20'
                }`}>
                  {isDone ? '✓' : i + 1}
                </div>
                {i < 3 && (
                  <div className={`h-px w-8 transition-all duration-500 ${thisIdx < stepIdx ? 'bg-green-500' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Step 1: Username ── */}
        {step === 'username' && (
          <div className="glass-bright rounded-2xl border border-green-500/20 p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/25 flex items-center justify-center text-base">𝕏</div>
              <div>
                <p className="font-mono font-semibold text-white text-sm">Enter X Username</p>
                <p className="text-xs text-white/40 font-mono">We'll fetch your profile picture automatically</p>
              </div>
            </div>

            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50 font-mono text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUsernameSubmit()}
                placeholder="yourhandle"
                className="input-genome pl-8"
                autoFocus
              />
            </div>

            {usernameError && (
              <p className="text-xs text-red-400 font-mono mb-4">{usernameError}</p>
            )}

            {/* Avatar preview */}
            {username.trim().length > 1 && (
              <div className="flex items-center gap-3 p-3 glass rounded-xl border border-green-500/10 mb-4">
                <img
                  src={getAvatarUrl(username.trim().replace('@', ''))}
                  alt="preview"
                  className="w-10 h-10 rounded-lg object-cover border border-green-500/20"
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
                <div>
                  <p className="text-xs font-mono text-white/60">@{username.trim().replace('@', '')}</p>
                  <p className="text-[10px] font-mono text-white/30">Avatar preview</p>
                </div>
              </div>
            )}

            <button
              onClick={handleUsernameSubmit}
              className="btn-primary w-full py-3 rounded-xl font-mono font-semibold text-sm"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── Step 2: Wallet ── */}
        {step === 'wallet' && (
          <div className="glass-bright rounded-2xl border border-green-500/20 p-6 animate-fade-in">
            {/* User preview */}
            <div className="flex items-center gap-3 mb-6 p-3 glass rounded-xl border border-green-500/10">
              <img
                src={avatarUrl}
                alt={username}
                className="w-12 h-12 rounded-xl object-cover border border-green-500/25"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`;
                }}
              />
              <div>
                <p className="font-mono font-semibold text-white text-sm">@{username}</p>
                <p className="text-xs text-green-400 font-mono">✓ Profile loaded</p>
              </div>
              <button
                onClick={() => setStep('username')}
                className="ml-auto text-xs text-white/30 hover:text-white/60 font-mono transition-colors"
              >
                edit
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/25 flex items-center justify-center text-base">⬡</div>
              <div>
                <p className="font-mono font-semibold text-white text-sm">Connect MetaMask</p>
                <p className="text-xs text-white/40 font-mono">Ritual Testnet · Chain ID 1979</p>
              </div>
            </div>

            {!isConnected ? (
              <>
                <div className="glass rounded-xl border border-green-500/10 p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-sm">⚠</span>
                    <span className="text-xs font-mono text-white/50">Make sure you have MetaMask installed</span>
                  </div>
                  <p className="text-xs text-white/30 font-mono">
                    We'll automatically add Ritual Testnet to your wallet if needed.
                  </p>
                </div>
                <button
                  onClick={connect}
                  disabled={isConnecting}
                  className="btn-primary w-full py-3 rounded-xl font-mono font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>⬡ Connect Wallet</>
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 p-3 glass rounded-xl border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-mono text-green-400">{shortAddr} connected</span>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Generating ── */}
        {step === 'generating' && (
          <div className="glass-bright rounded-2xl border border-green-500/20 p-8 text-center animate-fade-in">
            {/* DNA spinner */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-green-500/20 animate-spin" style={{ borderTopColor: '#22c55e', animationDuration: '1s' }} />
              <div className="absolute inset-2 rounded-full border-2 border-green-400/10 animate-spin" style={{ borderTopColor: '#4ade80', animationDuration: '1.5s', animationDirection: 'reverse' }} />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🧬</div>
            </div>

            <p className="font-mono font-bold text-white text-lg mb-2">Generating Genome</p>
            <p className="text-sm font-mono text-green-400 mb-6 min-h-[20px] transition-all">{genStatus}</p>

            {/* Progress bar */}
            <div className="genome-bar mb-2">
              <div className="genome-bar-fill" style={{ width: `${genProgress}%` }} />
            </div>
            <p className="text-xs font-mono text-white/30">{genProgress}% complete</p>
          </div>
        )}

        {/* ── Step 4: Done ── */}
        {step === 'done' && (
          <div className="glass-bright rounded-2xl border border-green-500/30 p-8 text-center animate-fade-in"
            style={{ boxShadow: '0 0 40px rgba(34,197,94,0.15)' }}>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-mono font-black text-white text-xl mb-2">
              {existingGenome ? 'Genome Found!' : 'Genome Minted!'}
            </h2>
            <p className="text-sm text-white/50 font-mono mb-6">
              {existingGenome
                ? 'Welcome back. Your genome is ready.'
                : 'Your digital DNA has been generated and saved.'}
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-primary w-full py-3 rounded-xl font-mono font-semibold text-sm"
            >
              View My Genome Dashboard →
            </button>
          </div>
        )}

        {/* Back link */}
        {step === 'username' && (
          <div className="text-center mt-6">
            <button onClick={() => onNavigate('landing')} className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors">
              ← Back to home
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}
