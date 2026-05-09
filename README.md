# Quick on My Feet

Your AI assistant for quick, natural replies.

Quick on My Feet helps users respond better in text messages, DMs, group chats, and work messages. Paste an incoming message, choose the relationship, tone, length, and voice, then get a quick vibe read plus copy-ready reply options.

## Current MVP: v0.3

This is a copy/paste web MVP built with Next.js and the OpenAI API.

### Core user flow

1. Paste the incoming message.
2. Choose relationship, tone, length, and voice preset.
3. Add optional context.
4. Generate vibe analysis, recommended strategy, and 5 reply options.
5. Copy a reply or regenerate with Less cringe, Try wittier, or Make warmer.
6. Mark reply quality for local MVP testing.

### MVP features

- Multiple tones including witty, funny, warm, professional, soft-no, comeback, and less-cringe
- Voice presets: Balanced, Casual, Confident, Dry humor, Warm, Korean-American, Executive
- Scenario buttons for fast demos
- One-click copy
- Local-only feedback capture: Good, Too cringe, Too long, Not my style
- `/feedback` page to review feedback stored in this browser
- `/privacy` page with MVP privacy baseline
- Demo mode when `OPENAI_API_KEY` is not configured
- Server-side input length limits and output normalization
- No login, no database, no app-stored conversation history

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open:

```bash
http://localhost:3000
```

Useful routes:

```bash
/
/privacy
/feedback
```

## Environment variables

Required for real AI replies:

```bash
OPENAI_API_KEY=your_api_key_here
```

Optional:

```bash
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is missing, the app returns demo replies so the UI can still be tested.

## Validation commands

```bash
npm run typecheck
npm run build
npm run check
```

## Vercel deployment

1. Import this GitHub repo into Vercel.
2. Go to Project Settings → Environment Variables.
3. Add `OPENAI_API_KEY`.
4. Optionally add `OPENAI_MODEL`.
5. Redeploy.

## Product positioning

**One-liner:**

> AI-powered reply coach for texts, DMs, and awkward conversations.

**Target early users:**

- Non-native English speakers who want more natural replies
- Users who want to sound less boring or less awkward in casual messages
- Professionals who want warmer Slack or DM replies
- Anyone who freezes when they need to respond quickly

## Next roadmap

### v0.4

- Browser extension exploration for web messaging tools
- Better prompt tuning from collected test cases
- Optional history with user consent
- Lightweight analytics with privacy review

### v1.0

- Auth + saved preferences
- Mobile-first PWA
- Keyboard integration feasibility exploration
- Subscription/paywall experiment
