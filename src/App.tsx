import React, { useState, useEffect } from 'react';
import { AppPage, Genome } from './types';
import { useWallet } from './hooks/useWallet';
import { getGenomeByWallet } from './lib/supabase';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MintPage from './pages/MintPage';
import DashboardPage from './pages/DashboardPage';
import ComparePage from './pages/ComparePage';
import LeaderboardPage from './pages/LeaderboardPage';

export default function App() {
  const [page, setPage] = useState<AppPage>('landing');
  const [genome, setGenome] = useState<Genome | null>(null);

  const { address, isConnected, connect, disconnect } = useWallet();

  // Auto-load existing genome when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      getGenomeByWallet(address).then(existing => {
        if (existing) {
          setGenome(existing);
          // If on landing/mint, redirect to dashboard
          setPage(prev =>
            prev === 'landing' || prev === 'mint' ? 'dashboard' : prev
          );
        }
      });
    }
  }, [isConnected, address]);

  const handleGenomeMinted = (newGenome: Genome) => {
    setGenome(newGenome);
    setPage('dashboard');
  };

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <LandingPage onNavigate={setPage} />;

      case 'mint':
        return (
          <MintPage
            onNavigate={setPage}
            onGenomeMinted={handleGenomeMinted}
          />
        );

      case 'dashboard':
        return (
          <DashboardPage
            genome={genome}
            onNavigate={setPage}
          />
        );

      case 'compare':
        return (
          <ComparePage
            currentGenome={genome}
            onNavigate={setPage}
          />
        );

      case 'leaderboard':
        return <LeaderboardPage onNavigate={setPage} />;

      default:
        return <LandingPage onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-genome-bg">
      <Navbar
        currentPage={page}
        onNavigate={setPage}
        walletAddress={address}
        onConnect={connect}
        onDisconnect={disconnect}
      />
      {renderPage()}
    </div>
  );
}
