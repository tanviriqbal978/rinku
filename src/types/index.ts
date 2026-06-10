export interface GenomeScores {
  builder: number;
  explorer: number;
  researcher: number;
  creator: number;
  collector: number;
}

export interface Genome {
  id?: string;
  wallet_address: string;
  twitter_username: string;
  avatar_url: string;
  archetype: string;
  archetype_description: string;
  archetype_strengths: string[];
  genome_scores: GenomeScores;
  traits: string[];
  ai_summary: string;
  strength_analysis: string;
  growth_opportunities: string;
  participation_insights: string;
  evolution_level: number;
  xp_score: number;
  created_at?: string;
  updated_at?: string;
}

export interface Archetype {
  name: string;
  description: string;
  strengths: string[];
  icon: string;
  color: string;
}

export type ArchetypeName =
  | 'The Architect'
  | 'The Pathfinder'
  | 'The Oracle'
  | 'The Alchemist'
  | 'The Guardian'
  | 'The Innovator';

export interface LeaderboardEntry {
  twitter_username: string;
  avatar_url: string;
  archetype: string;
  genome_scores: GenomeScores;
  xp_score: number;
  evolution_level: number;
  traits: string[];
}

export type AppPage = 'landing' | 'mint' | 'dashboard' | 'compare' | 'leaderboard';
