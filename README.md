# Quick on My Feet

Your AI wingman for witty, natural replies.

Quick on My Feet helps users respond better in texts, DMs, group chats, dating conversations, and work messages. Paste an incoming message, choose the relationship and tone, and get a quick vibe read plus copy-ready reply options.

## Current MVP

This is a copy/paste web MVP built with Next.js and the OpenAI API.

### Core user flow

1. Paste the incoming message.
2. Choose relationship, tone, and length.
3. Add optional context.
4. Generate:
   - vibe analysis
   - recommended strategy
   - 5 reply options
   - copy-ready text

### MVP features

- Witty, funny, flirty, warm, professional, soft-no, comeback, and less-cringe tones
- Scenario buttons for fast demos
- One-click copy
- Demo mode when `OPENAI_API_KEY` is not configured
- Server-side input length limits
- No login, no database, no stored conversation history

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

## Vercel deployment

1. Import this GitHub repo into Vercel.
2. Go to Project Settings → Environment Variables.
3. Add `OPENAI_API_KEY`.
4. Redeploy.

## Product positioning

**One-liner:**

> AI-powered witty reply coach for texts, DMs, and awkward conversations.

**Target early users:**

- Non-native English speakers who want more natural replies
- Dating app users who do not want to sound boring or cringe
- Professionals who want warmer Slack/DM replies
- Anyone who freezes when they need to respond quickly

## Next roadmap

### v0.3

- Add feedback buttons: Good / Too cringe / Too long / Not my style
- Add saved personal voice presets
- Add shareable landing page copy
- Add analytics for generation events

### v0.4

- Chrome extension for WhatsApp Web, LinkedIn, Slack, and Gmail
- Better prompt tuning from collected test cases
- Optional history with user consent

### v1.0

- Auth + saved preferences
- Mobile-first PWA
- iOS keyboard feasibility exploration
- Subscription/paywall experiment
