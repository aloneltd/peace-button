import type { VercelRequest, VercelResponse } from '@vercel/node'
import { complete, stream, rateLimit, clientIp, AiError, type Msg } from './_lib/fastai.js'

/**
 * /api/ai — peace-plan generation.
 *
 * Provider chain lives in _lib/fastai.ts:
 *   Groq openai/gpt-oss-120b → gpt-oss-20b → gemini-2.5-flash (thinking off) → gemini-3.5-flash-lite
 * Groq answers a short JSON plan in well under a second, which is what makes the plan screen
 * feel instant instead of "wait five seconds while someone is mid-argument".
 *
 * Request contract is unchanged from the Gemini-only version:
 *   { messages: [{role,text}], systemInstruction?, temperature?, maxTokens?, jsonMode? }
 * Response: { text }   (plus { model } for debugging — the client ignores unknown fields)
 * Optional: { stream: true } → text/plain deltas.
 *
 * Caching: fastai keeps a module-level LRU (250 entries, 10-min TTL) keyed by the full prompt.
 * Two people describing the same spark get one upstream call; nobody's private text leaves the
 * lambda, and the key includes every input that changes the answer.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!rateLimit(clientIp(req.headers as Record<string, unknown>), 15)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' })
  }

  const {
    messages,
    systemInstruction,
    temperature = 0.8,
    maxTokens = 1024,
    jsonMode = false,
    stream: wantStream = false,
  } = (req.body ?? {}) as {
    messages?: { role: string; text: string }[]
    systemInstruction?: string
    temperature?: number
    maxTokens?: number
    jsonMode?: boolean
    stream?: boolean
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const opts = {
    messages: messages.slice(-10).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      text: m.text,
    })) as Msg[],
    system: systemInstruction,
    json: Boolean(jsonMode),
    temperature: Number(temperature) || 0.8,
    maxTokens: Math.min(Number(maxTokens) || 1024, 2048),
    timeoutMs: 18_000,
  }

  try {
    if (wantStream && !jsonMode) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.setHeader('X-Accel-Buffering', 'no')
      await stream(opts, (delta) => res.write(delta))
      return res.end()
    }

    const r = await complete(opts)
    return res.status(200).json({ text: r.text, model: r.model, cached: r.cached })
  } catch (e: unknown) {
    if (e instanceof AiError) {
      console.error('[api/ai]', e.debug)
      return res.status(e.status).json({ error: e.message })
    }
    const message = e instanceof Error ? e.message : 'Unknown AI error'
    console.error('[api/ai]', message)
    return res.status(500).json({ error: message })
  }
}
