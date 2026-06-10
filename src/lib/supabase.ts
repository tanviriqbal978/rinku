import { createClient } from '@supabase/supabase-js';
import { Genome, LeaderboardEntry } from '../types';

console.log("SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("SUPABASE_KEY:", import.meta.env.VITE_SUPABASE_KEY);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// SQL to run in Supabase SQL Editor:
/*
CREATE TABLE IF NOT EXISTS genomes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text UNIQUE NOT NULL,
  twitter_username text NOT NULL,
  avatar_url text,
  archetype text,
  archetype_description text,
  archetype_strengths text[],
  genome_scores jsonb,
  traits text[],
  ai_summary text,
  strength_analysis text,
  growth_opportunities text,
  participation_insights text,
  evolution_level int DEFAULT 1,
  xp_score int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE genomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON genomes FOR SELECT USING (true);
CREATE POLICY "Anyone insert" ON genomes FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner update" ON genomes FOR UPDATE USING (true);
*/

export async function saveGenome(genome: Genome): Promise<Genome | null> {
  const { data, error } = await supabase
    .from('genomes')
    .upsert(
      {
        wallet_address: genome.wallet_address.toLowerCase(),
        twitter_username: genome.twitter_username,
        avatar_url: genome.avatar_url,
        archetype: genome.archetype,
        archetype_description: genome.archetype_description,
        archetype_strengths: genome.archetype_strengths,
        genome_scores: genome.genome_scores,
        traits: genome.traits,
        ai_summary: genome.ai_summary,
        strength_analysis: genome.strength_analysis,
        growth_opportunities: genome.growth_opportunities,
        participation_insights: genome.participation_insights,
        evolution_level: genome.evolution_level,
        xp_score: genome.xp_score,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'wallet_address' }
    )
    .select()
    .single();
  if (error) { console.error('Supabase save error:', error); return null; }
  return data as Genome;
}

export async function getGenomeByWallet(walletAddress: string): Promise<Genome | null> {
  const { data, error } = await supabase
    .from('genomes')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .single();
  if (error) return null;
  return data as Genome;
}

export async function getGenomeByUsername(username: string): Promise<Genome | null> {
  const { data, error } = await supabase
    .from('genomes')
    .select('*')
    .ilike('twitter_username', username)
    .single();
  if (error) return null;
  return data as Genome;
}

export async function getLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('genomes')
    .select('twitter_username, avatar_url, archetype, genome_scores, xp_score, evolution_level, traits')
    .order('xp_score', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data as LeaderboardEntry[];
}

export async function getAllGenomes(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('genomes')
    .select('twitter_username, avatar_url, archetype, genome_scores, xp_score, evolution_level, traits')
    .order('xp_score', { ascending: false })
    .limit(50);
  if (error) return [];
  return data as LeaderboardEntry[];
}
