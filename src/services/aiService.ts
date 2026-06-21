import type { TriggerEntry, PeacePlan } from '../types';

const FALLBACK_PLAN: PeacePlan = {
  openWith: "I need a few minutes to collect myself before we talk. I want to get this right.",
  nameYourNeed: "I need to feel heard and understood, not just fixed or dismissed.",
  offerAStep: "Let's set a specific time in the next hour to sit down together — no phones, no distractions.",
  bridgeNow: "I care about us. I'll be back in 20 minutes.",
  patternNote: undefined,
};

const buildHistorySummary = (history: TriggerEntry[]): string => {
  if (history.length === 0) return 'No prior sessions.';
  const lines = history.slice(0, 10).map(e => {
    const d = new Date(e.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const afterNote = e.intensityAfterCalm !== undefined ? ` → ${e.intensityAfterCalm}` : '';
    const desc = e.description ? ` ("${e.description.slice(0, 60)}")` : '';
    return `${d}: intensity ${e.intensity}${afterNote}${desc}`;
  });
  return lines.join('\n');
};

export const generatePeacePlan = async (
  entry: Partial<TriggerEntry>,
  history: TriggerEntry[]
): Promise<PeacePlan> => {
  const systemInstruction = `You are a senior couples therapist trained in EFT, DBT, and polyvagal theory.
Help a person who just finished a breathing exercise de-escalate a relationship conflict.
Tone: warm, specific, non-generic. Use "I" statements. Never say "try active listening."
Write as if you know this specific person and this specific moment.

Rules:
- openWith: 1-2 sentences they can literally say. Soft, non-accusatory.
- nameYourNeed: 1-2 sentences naming their core emotional need. First-person.
- offerAStep: 1 concrete, small, non-threatening action for the next 30 minutes.
- bridgeNow: The single sentence to say RIGHT NOW that bids for connection without reopening the wound. Very short (under 15 words). E.g. "I care about us and I'll be back in 20 minutes."
- patternNote: ONLY if history shows a repeating pattern (same theme 3+ times). One sentence of insight. Otherwise omit entirely.

WOT context: if wot=too-fast, the person is hyperaroused (racing/hot) — help them slow down and create distance first. If wot=too-slow, they're hypoaroused (frozen/numb) — help them gently reconnect and re-engage. If balanced, standard plan.

Return ONLY valid JSON with fields: openWith, nameYourNeed, offerAStep, bridgeNow, patternNote (optional).`;

  const wotLabel =
    entry.wot === 'too-fast' ? 'hyperaroused (racing, hot, urgent)' :
    entry.wot === 'too-slow' ? 'hypoaroused (numb, frozen, flat)' :
    'more balanced';

  const userMessage = `Current moment:
- Window of Tolerance: ${wotLabel}
- Intensity coming in: ${entry.intensity ?? '?'}/10
- Intensity after breathing: ${entry.intensityAfterCalm ?? '?'}/10
- What sparked this: ${entry.description || 'Not provided'}

Session history (last 10 entries):
${buildHistorySummary(history)}

Generate my peace plan as JSON.`;

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', text: userMessage }],
        systemInstruction,
        temperature: 0.8,
        maxTokens: 1024,
      }),
    });

    if (!response.ok) {
      console.error('AI request failed:', response.status);
      return FALLBACK_PLAN;
    }

    const data = await response.json();
    const text: string = data.text ?? '';

    const clean = text
      .replace(/^```(?:json)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    const parsed = JSON.parse(clean) as PeacePlan;
    return parsed;
  } catch (err) {
    console.error('AI service error:', err);
    return FALLBACK_PLAN;
  }
};
