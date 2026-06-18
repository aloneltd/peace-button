# Peace Button

## Live URLs
- Production: https://peace-button.vercel.app
- GitHub: https://github.com/aloneltd/peace-button

## Stack
- Vite + React 19 + TypeScript
- Tailwind CSS v4 (build dependency, not CDN)
- Recharts (DotMap / Insights charts)
- Vercel serverless function at /api/ai (Node.js)
- Google Gemini 2.5 Flash via @google/genai

## Environment Variables (set in Vercel dashboard)
| Variable | Required | Description |
|---|---|---|
| GEMINI_API_KEY | Yes | Google AI Studio API key — enables PeacePlan generation |

## Deploy
Push to `main` on GitHub → Vercel auto-deploys.
Never use `vercel` CLI to deploy.

## Features
- Safety screen on first open (crisis resources, acknowledgement)
- Optional passcode lock (localStorage)
- Trigger intake wizard: intensity slider, category, need, risk factors, description
- Calm module: grounding → box breathing → reframe → intensity re-check
- AI PeacePlan output: soft+direct text variants, spoken script, connection question, boundary option, repair-later
- Insights log: bar chart of triggers by category, recent sessions
- Perspective (DotMap): life weeks visualization, relationship weeks highlighted
- Settings: passcode toggle, export, clear data, disclaimer

## Privacy Model
All entries stored in localStorage only. Zero server-side persistence. AI call goes through /api/ai proxy (key never exposed to client). No login required.
