import type { TriggerEntry, PeacePlan } from '../types';

export const generatePeacePlan = async (entry: TriggerEntry): Promise<PeacePlan> => {
  const messages = [
    {
      role: 'user',
      text: `
Timing context: ${entry.timing}.
User is feeling an intensity of ${entry.intensity}/10.
Topic: ${entry.category}.
Core need: ${entry.need}.
Risk factors: ${entry.riskFactors.join(', ') || 'none'}.
Situation: "${entry.description || 'No description provided.'}"
Communication mode: ${entry.isText ? 'Texting' : entry.isInPerson ? 'In-person' : 'Any mode'}.

Return ONLY valid JSON matching the PeacePlan type with these fields:
- textMessage: { soft: string, direct: string }
- spokenScript: string
- connectionQuestion: string
- boundaryOption: string
- repairLater: { prompts: string[], plan: string }
      `.trim(),
    },
  ];

  const systemInstruction = `You are a senior relationship counselor. Help a triggered user de-escalate conflict with their partner.
Tone: calm, grounded, non-judgmental. Rules: No labels like "toxic/narcissistic". Use "I" statements.
If intensity >= 7, prioritize a Pause Script in the boundary section.
Provide Soft (very gentle) and Direct (clear but respectful) variants.
REPAIR STRATEGY: Acknowledge -> Validate -> Next Step (concrete action).
Return ONLY valid JSON matching the PeacePlan type.`;

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      systemInstruction,
      temperature: 0.7,
      maxTokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `AI request failed: ${response.status}`);
  }

  const data = await response.json();
  const text: string = data.text ?? '';

  try {
    // Strip markdown code fences if present
    const clean = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    return JSON.parse(clean) as PeacePlan;
  } catch {
    throw new Error('Could not parse AI response as PeacePlan JSON.');
  }
};
