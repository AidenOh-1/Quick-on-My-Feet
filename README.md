# Quick on My Feet

AI-powered witty reply coach for texts, DMs, and awkward conversations.

## What it does

Paste a message, choose the relationship and tone, and get:
- a quick vibe read
- multiple reply options
- safer / wittier / shorter variations
- one-click copy

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Environment variable

```bash
OPENAI_API_KEY=your_api_key_here
```

If the API key is missing, the app returns demo replies so the UI still works.

## Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add `OPENAI_API_KEY` in Vercel Project Settings → Environment Variables.
4. Deploy.

## MVP scope

This version is intentionally simple:
- no login
- no chat storage
- no database
- copy/paste workflow first
