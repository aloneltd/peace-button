import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenAI } from '@google/genai'

// Module-level: allocated once per warm serverless instance
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// Free-tier resilience: when gemini-2.5-flash returns 429/503 we retry once on gemini-3.5-flash-lite,
// which has its own quota bucket. (gemini-2.5-flash-lite is retired on this key → 404.)
const MODELS = ['gemini-2.5-flash', 'gemini-3.5-flash-lite'] as const
function isQuotaError(e: unknown): boolean {
  const m = e instanceof Error ? e.message : String(e)
  return /429|503|RESOURCE_EXHAUSTED|UNAVAILABLE|quota|overloaded/i.test(m)
}

const responseCache = new Map<string, { text: string; expiresAt: number }>()
const CACHE_TTL = 300_000

// Free-tier guard: 10 req/min per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Too many requests. Please wait a moment.' })

  const { messages, systemInstruction, temperature = 0.7, maxTokens = 2048, jsonMode = false } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const lastMsg = (messages as { role: string; text: string }[]).filter((m) => m.role === 'user').at(-1)?.text ?? ''
  const cacheKey = `gemini-2.5-flash::${jsonMode ? 'json' : 'text'}::${systemInstruction ?? ''}::${lastMsg}`
  const now = Date.now()
  const cached = responseCache.get(cacheKey)
  if (cached && now < cached.expiresAt) return res.status(200).json({ text: cached.text })

  try {
    const r = await Promise.race([
      (async () => {
        let lastErr: unknown
        for (const model of MODELS) {
          try {
            return await ai.models.generateContent({
              model,
              contents: messages.slice(-10).map((m: { role: string; text: string }) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
              })),
              config: {
                systemInstruction,
                temperature,
                maxOutputTokens: Math.min(Number(maxTokens) || 2048, 2048),
                // gemini-2.5-flash is a thinking model: without this its reasoning eats the output
                // budget and the JSON plan comes back truncated ("Unterminated string in JSON").
                ...(model === 'gemini-2.5-flash' ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
                ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
              },
            })
          } catch (e) {
            lastErr = e
            if (!isQuotaError(e) || model === MODELS[MODELS.length - 1]) throw e
            console.warn(`[api/ai] ${model} quota/unavailable — retrying on the next model`)
          }
        }
        throw lastErr
      })(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000)),
    ])

    const text = r.text ?? ''
    if (text) responseCache.set(cacheKey, { text, expiresAt: now + CACHE_TTL })
    return res.status(200).json({ text })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown AI error'
    console.error('AI proxy error:', message)
    return res.status(500).json({ error: message })
  }
}
