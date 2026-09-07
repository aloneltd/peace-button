#!/bin/bash
# One-time setup: copies the AI provider keys from the old (rate-limited) Vercel team's
# peace-button project to the new "mark-9439" account's peace-button project, then redeploys.
#
# Why this exists: the old team (m-7231s-projects) hit Vercel's daily deploy cap
# ("Deployment rate limited — retry in 24 hours") on 2026-09-07, so today's red-team fixes were
# deployed to the new account instead: https://peace-button-ten.vercel.app
# That project has no env vars yet, so /api/ai will 502 there until GROQ_API_KEY and
# GEMINI_API_KEY are copied over. The app still degrades gracefully without them (it shows the
# honest built-in fallback plan instead of a personalized one) — this just restores real AI.
#
# This script contains NO secret values. It reads them from the OLD team's peace-button project
# (you must already be logged into the Vercel CLI with access to m-7231s-projects — the normal
# `vercel` login) and writes them straight into the NEW project without ever printing them.
#
# Run once from this folder:  bash set-env.sh

set -e
cd "$(dirname "$0")"

OLD_ORG_ID="team_296vEnguI73f5ESSuZAEvFVb"
OLD_PROJECT_ID="prj_MfZ0XGv89NQTCURKgtardZ03BFfl"
NEW_ORG_ID="team_6I3OyvFRH1M4YOPvYcUg5Sqx"
NEW_PROJECT_ID="prj_oWPPeGjFEToyfRHM27qBEw3EVeNV"

echo "Pulling secrets from the OLD team's peace-button project..."
VERCEL_ORG_ID="$OLD_ORG_ID" VERCEL_PROJECT_ID="$OLD_PROJECT_ID" \
  vercel env pull .env.pb-secrets.local production

echo "Pushing GROQ_API_KEY and GEMINI_API_KEY to the NEW account's peace-button project..."
grep '^GROQ_API_KEY=' .env.pb-secrets.local | cut -d= -f2- | tr -d '"' | \
  VERCEL_ORG_ID="$NEW_ORG_ID" VERCEL_PROJECT_ID="$NEW_PROJECT_ID" \
  vercel --global-config ~/.vercel-mark2 env add GROQ_API_KEY production

grep '^GEMINI_API_KEY=' .env.pb-secrets.local | cut -d= -f2- | tr -d '"' | \
  VERCEL_ORG_ID="$NEW_ORG_ID" VERCEL_PROJECT_ID="$NEW_PROJECT_ID" \
  vercel --global-config ~/.vercel-mark2 env add GEMINI_API_KEY production

rm -f .env.pb-secrets.local

echo "Redeploying the new-account project with the keys in place..."
VERCEL_ORG_ID="$NEW_ORG_ID" VERCEL_PROJECT_ID="$NEW_PROJECT_ID" \
  vercel --global-config ~/.vercel-mark2 --prod --yes

echo "Done. Live at: https://peace-button-ten.vercel.app"
echo "(Once the old team's daily deploy cap resets, 'git push origin main' from this folder"
echo " will resume updating the real peace-button.vercel.app as before.)"
