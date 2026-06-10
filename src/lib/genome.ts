import { GenomeScores, Archetype, ArchetypeName } from '../types';

function hashString(str: string): number[] {
  const bytes: number[] = [];
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0;
  }
  for (let i = 0; i < 20; i++) {
    hash = ((hash << 5) + hash) ^ (i * 37);
    hash = hash >>> 0;
    bytes.push(hash % 256);
  }
  return bytes;
}

export function generateGenomeScores(walletAddress: string, twitterUsername: string): GenomeScores {
  const seed = hashString(walletAddress.toLowerCase() + twitterUsername.toLowerCase());
  const raw = {
    builder:    10 + (seed[0] + seed[1]) % 50,
    explorer:   10 + (seed[2] + seed[3]) % 40,
    researcher: 10 + (seed[4] + seed[5]) % 35,
    creator:    10 + (seed[6] + seed[7]) % 35,
    collector:  10 + (seed[8] + seed[9]) % 30,
  };
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  return {
    builder:    Math.round((raw.builder / total) * 100),
    explorer:   Math.round((raw.explorer / total) * 100),
    researcher: Math.round((raw.researcher / total) * 100),
    creator:    Math.round((raw.creator / total) * 100),
    collector:  100
      - Math.round((raw.builder / total) * 100)
      - Math.round((raw.explorer / total) * 100)
      - Math.round((raw.researcher / total) * 100)
      - Math.round((raw.creator / total) * 100),
  };
}

export function generateEvolutionLevel(walletAddress: string): number {
  const seed = hashString(walletAddress);
  return 1 + (seed[10] % 10);
}

export function generateXP(walletAddress: string): number {
  const seed = hashString(walletAddress);
  return 100 + (seed[11] * seed[12]) % 9900;
}

export const ARCHETYPES: Record<ArchetypeName, Archetype> = {
  'The Architect': {
    name: 'The Architect',
    description: 'A master builder who shapes the foundation of the Ritual ecosystem. You design, construct, and fortify the protocols that others build upon.',
    strengths: ['Protocol Design', 'Smart Contract Architecture', 'System Optimization', 'Infrastructure Building'],
    icon: '⚡',
    color: '#22c55e',
  },
  'The Pathfinder': {
    name: 'The Pathfinder',
    description: 'An eternal explorer who charts unknown territories in the Ritual network. You discover new possibilities before anyone else.',
    strengths: ['Network Exploration', 'Early Adoption', 'Cross-Chain Navigation', 'Opportunity Spotting'],
    icon: '🧭',
    color: '#4ade80',
  },
  'The Oracle': {
    name: 'The Oracle',
    description: 'A deep researcher who sees patterns others cannot. Your analytical mind deciphers the most complex on-chain data.',
    strengths: ['Data Analysis', 'Pattern Recognition', 'AI Integration', 'Predictive Modeling'],
    icon: '🔮',
    color: '#86efac',
  },
  'The Alchemist': {
    name: 'The Alchemist',
    description: 'A creative force who transforms raw blockchain data into digital gold. You forge unique on-chain experiences.',
    strengths: ['Creative Innovation', 'Protocol Combination', 'Unique Strategies', 'Value Creation'],
    icon: '⚗️',
    color: '#16a34a',
  },
  'The Guardian': {
    name: 'The Guardian',
    description: 'A steadfast collector and protector of the Ritual ecosystem. Your portfolio reflects deep commitment and loyalty.',
    strengths: ['Asset Collection', 'Long-term Vision', 'Ecosystem Support', 'Community Trust'],
    icon: '🛡️',
    color: '#15803d',
  },
  'The Innovator': {
    name: 'The Innovator',
    description: 'A balanced visionary who excels across all genome traits. Your versatile nature makes you an invaluable pillar of the ecosystem.',
    strengths: ['Versatility', 'Balanced Approach', 'Adaptive Strategy', 'Cross-Domain Mastery'],
    icon: '🌟',
    color: '#4ade80',
  },
};

export function determineArchetype(scores: GenomeScores): ArchetypeName {
  const max = Math.max(...Object.values(scores));
  if (max < 35) return 'The Innovator';
  if (scores.builder === max) return 'The Architect';
  if (scores.explorer === max) return 'The Pathfinder';
  if (scores.researcher === max) return 'The Oracle';
  if (scores.creator === max) return 'The Alchemist';
  return 'The Guardian';
}

const ALL_TRAITS = [
  'Infernet Pioneer', 'Network Explorer', 'Master Builder',
  'Ritual Veteran', 'AI Researcher', 'DeFi Architect',
  'Protocol Wizard', 'Chain Navigator', 'Genesis Member',
  'Alpha Tester', 'Node Runner', 'Smart Contractor',
];

export function generateTraits(walletAddress: string, scores: GenomeScores): string[] {
  const seed = hashString(walletAddress);
  const count = 2 + (seed[15] % 3);
  const indices = new Set<number>();
  for (let i = 0; i < count; i++) {
    indices.add((seed[i + 13] + seed[i]) % ALL_TRAITS.length);
  }
  const archetype = determineArchetype(scores);
  if (archetype === 'The Architect') indices.add(ALL_TRAITS.indexOf('Master Builder'));
  if (archetype === 'The Oracle') indices.add(ALL_TRAITS.indexOf('AI Researcher'));
  if (archetype === 'The Pathfinder') indices.add(ALL_TRAITS.indexOf('Network Explorer'));
  return Array.from(indices).map(i => ALL_TRAITS[i]);
}
