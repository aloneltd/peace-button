import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenAI } from '@google/genai'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' })
  }

  const { messages, systemInstruction, temperature = 0.7, maxTokens = 2048 } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const ai = new GoogleGenAI({ apiKey })

  try {
    const r = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: messages.map((m: { role: string; text: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
      config: {
        systemInstruction,
        temperature,
        maxOutputTokens: maxTokens,
      },
    })

    return res.status(200).json({ text: r.text ?? '' })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown AI error'
    console.error('AI proxy error:', message)
    return res.status(500).json({ error: message })
  }
}
