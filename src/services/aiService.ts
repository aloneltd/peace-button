import type { TriggerEntry, PeacePlan } from '../types';

const FALLBACK_PLAN: PeacePlan = {
  openWith: "I need a few minutes to collect myself before we talk. I want to get this right.",
  nameYourNeed: "I need to feel heard and understood, not just fixed or dismissed.",
  offerAStep: "Let's set a specific time in the next hour to sit down together — no phones, no distractions.",
  bridgeNow: "I care about us. I'll be back in 20 minutes.",
  patternNote: undefined,
  isFallback: true,
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

// Tolerant JSON extraction: strips ``` fences, then falls back to the outermost {...} block.
const parsePlan = (raw: string): PeacePlan | null => {
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  const candidates = [clean];
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start !== -1 && end > start) candidates.push(clean.slice(start, end + 1));
  for (const c of candidates) {
    try {
      const obj = JSON.parse(c) as Partial<PeacePlan>;
      if (obj && typeof obj.openWith === 'string' && typeof obj.bridgeNow === 'string') {
        return {
          openWith: obj.openWith,
          nameYourNeed: obj.nameYourNeed || FALLBACK_PLAN.nameYourNeed,
          offerAStep: obj.offerAStep || FALLBACK_PLAN.offerAStep,
          bridgeNow: obj.bridgeNow,
          patternNote: obj.patternNote || undefined,
        };
      }
    } catch { /* try next candidate */ }
  }
  return null;
};

export const generatePeacePlan = async (
  entry: Partial<TriggerEntry>,
  history: TriggerEntry[]
): Promise<PeacePlan> => {
  // Written for a fast instruction-following model (Groq gpt-oss). The earlier, looser prompt
  // let it drift into talking *about* the user ("I hear how intense this feels for you") instead
  // of ghostwriting words the user can actually say out loud. Every rule below is load-bearing.
  const systemInstruction = `You are a senior couples therapist trained in EFT, DBT and polyvagal theory, ghostwriting for someone who has just finished a breathing exercise mid-conflict.

CRITICAL: every field except patternNote is a line the USER will SAY OUT LOUD to their partner, written in the user's own first-person voice. You are not talking to the user. Never write "I hear that you...", never mention breathing, this app, therapy, exercises, or a "peace plan". No therapy-speak. No "try active listening".

Ground the words in the specific thing that sparked this — reference it the way a real person would, without repeating it back like an accusation.

Field rules:
- openWith: 1-2 sentences they can literally say. Soft, non-accusatory, first person.
- nameYourNeed: 1-2 sentences naming their core emotional need, said aloud to the partner.
- offerAStep: one sentence proposing a small, concrete, non-threatening thing for the next 30 minutes.
- bridgeNow: the single sentence to say RIGHT NOW. MAXIMUM 15 WORDS. Warm, bids for connection, does not reopen the wound.
- patternNote: ONLY if the history shows the same theme 3+ times. One sentence of insight about the user — the one field that is not spoken aloud. Otherwise omit the key entirely.

Window of tolerance: if wot=too-fast the person is hyperaroused (racing, hot) — the words should slow things down and buy space. If wot=too-slow they are hypoaroused (frozen, numb) — the words should gently re-engage. If balanced, standard.

Return ONLY valid JSON with keys: openWith, nameYourNeed, offerAStep, bridgeNow, patternNote (optional).`;

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

  // REDTEAM: the server-side chain has its own 18s timeout, but that only protects against a
  // slow *upstream provider* — a stalled connection to /api/ai itself (bad network, a proxy that
  // swallows the request) never reaches that code and previously left the plan screen showing
  // the skeleton forever with no signal to the user (the only escape was noticing the always-
  // present "I'm ready" button and giving up on a personalized plan). A client-side abort after
  // 20s guarantees the person gets a fallback plan on its own instead of relying on them to bail.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', text: userMessage }],
        systemInstruction,
        temperature: 0.8,
        maxTokens: 700,
        jsonMode: true,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('AI request failed:', response.status);
      return FALLBACK_PLAN;
    }

    const data = await response.json();
    const text: string = data.text ?? '';

    const parsed = parsePlan(text);
    if (!parsed) {
      console.error('AI returned no parseable plan:', text.slice(0, 200));
      return FALLBACK_PLAN;
    }
    return parsed;
  } catch (err) {
    console.error('AI service error:', err);
    return FALLBACK_PLAN;
  } finally {
    clearTimeout(timeout);
  }
};
