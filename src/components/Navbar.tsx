import React, { useState } from 'react';
import { AppPage } from '../types';
import { formatAddress } from '../lib/wallet';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Navbar({ currentPage, onNavigate, walletAddress, onConnect, onDisconnect }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: { label: string; page: AppPage }[] = [
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Leaderboard', page: 'leaderboard' },
    { label: 'Compare', page: 'compare' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-bright border-b border-green-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center group-hover:border-green-400/60 transition-all">
              <span className="text-base">🧬</span>
            </div>
            <span className="font-mono font-bold text-green-400 text-sm tracking-wider group-hover:text-green-300 transition-colors">
              RITUAL<span className="text-white/60">·</span>GENOME
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all ${
                  currentPage === page
                    ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                    : 'text-white/50 hover:text-green-400 hover:bg-green-500/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden md:flex items-center gap-3">
            {walletAddress ? (
              <div className="flex items-center gap-2">
                {/* Chain indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono text-green-400">Ritual</span>
                </div>
                {/* Address */}
                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-green-500/20 hover:border-red-500/40 hover:bg-red-500/5 transition-all group"
                  title="Click to disconnect"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-xs">
                    {walletAddress.slice(2, 4).toUpperCase()}
                  </div>
                  <span className="text-xs font-mono text-white/70 group-hover:text-red-400 transition-colors">
                    {formatAddress(walletAddress)}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="btn-primary px-4 py-2 rounded-lg text-sm font-mono font-medium flex items-center gap-2"
              >
                <span>⬡</span>
                Connect Wallet
              </button>
            )}

            {/* Mint CTA */}
            <button
              onClick={() => onNavigate('mint')}
              className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all flex items-center gap-2 ${
                currentPage === 'mint'
                  ? 'bg-green-500/20 text-green-300 border border-green-400/40'
                  : 'btn-primary'
              }`}
            >
              <span>🧬</span>
              Mint Genome
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg border border-green-500/20 text-green-400"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 flex flex-col gap-1">
              <span className={`block h-0.5 bg-green-400 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-green-400 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-green-400 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-bright border-t border-green-500/10 px-4 py-4 flex flex-col gap-2">
          {navLinks.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => { onNavigate(page); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-mono transition-all ${
                currentPage === page
                  ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                  : 'text-white/50 hover:text-green-400 hover:bg-green-500/5'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="border-t border-green-500/10 pt-3 mt-1 flex flex-col gap-2">
            {walletAddress ? (
              <div className="flex items-center justify-between px-4 py-2 glass rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono text-green-400">{formatAddress(walletAddress)}</span>
                </div>
                <button onClick={onDisconnect} className="text-xs text-red-400/70 hover:text-red-400 font-mono">
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onConnect(); setMenuOpen(false); }}
                className="btn-primary w-full py-2.5 rounded-lg text-sm font-mono font-medium"
              >
                Connect Wallet
              </button>
            )}
            <button
              onClick={() => { onNavigate('mint'); setMenuOpen(false); }}
              className="btn-primary w-full py-2.5 rounded-lg text-sm font-mono font-semibold flex items-center justify-center gap-2"
            >
              <span>🧬</span> Mint Genome
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
