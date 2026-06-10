import { GenomeScores, ArchetypeName } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL || '';

interface AIInsights {
  ai_summary: string;
  strength_analysis: string;
  growth_opportunities: string;
  participation_insights: string;
}

export async function generateAIInsights(
  twitterUsername: string,
  scores: GenomeScores,
  archetype: ArchetypeName,
  traits: string[]
): Promise<AIInsights> {
  const prompt = `You are an AI analyst for the Ritual blockchain ecosystem. Generate a personalized genome analysis for a user.

User: @${twitterUsername}
Archetype: ${archetype}
Genome Scores:
- Builder: ${scores.builder}%
- Explorer: ${scores.explorer}%
- Researcher: ${scores.researcher}%
- Creator: ${scores.creator}%
- Collector: ${scores.collector}%
Traits: ${traits.join(', ')}

Generate a JSON response with exactly these 4 fields (2-3 sentences each, futuristic tone):
{
  "ai_summary": "Overall personality summary for this user",
  "strength_analysis": "What they excel at in the Ritual ecosystem",
  "growth_opportunities": "Areas where they can grow and level up",
  "participation_insights": "How they engage with the community"
}

Return ONLY the JSON object, no markdown, no extra text.`;

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return parsed as AIInsights;
  } catch (err) {
    console.error('Groq error:', err);
    // Fallback static insights
    return {
      ai_summary: `Your genome reveals a ${archetype} profile with strong ${Object.entries(scores).sort((a,b) => b[1]-a[1])[0][0]} tendencies. You are a key contributor to the Ritual ecosystem.`,
      strength_analysis: `You excel in ${traits.slice(0,2).join(' and ')}, demonstrating exceptional capability in building and exploring the Ritual network.`,
      growth_opportunities: `Expanding your ${Object.entries(scores).sort((a,b) => a[1]-b[1])[0][0]} score will unlock new evolution levels and rare genome traits.`,
      participation_insights: `Your on-chain activity reflects consistent engagement with the Ritual ecosystem, positioning you as a valuable ecosystem participant.`,
    };
  }
}
