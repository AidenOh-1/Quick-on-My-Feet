import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type RequestBody = {
  message?: string;
  relationship?: string;
  tone?: string;
  length?: string;
  voice?: string;
  humorLevel?: string;
  context?: string;
};

const MAX_MESSAGE_LENGTH = 1600;
const MAX_CONTEXT_LENGTH = 600;

const demoReplies = {
  vibe: "This is a low-stakes overshare/joke moment. A tiny dramatic one-liner will work better than a normal helpful reply.",
  strategy: "Treat the situation like a mock-heroic quest: short, absurd, and easy to laugh at.",
  replies: [
    {
      label: "Pop culture",
      text: "May the Force be with me 😂",
      why: "Turns a bathroom emergency into a tiny heroic mission."
    },
    {
      label: "Dramatic",
      text: "Tell my story if I don’t make it back.",
      why: "Classic overdramatic escalation for a low-stakes problem."
    },
    {
      label: "Mission mode",
      text: "Going dark. This is not a drill.",
      why: "Makes it feel like an action movie moment."
    },
    {
      label: "Absurd",
      text: "I’m entering the final boss level.",
      why: "Game reference, short and silly."
    },
    {
      label: "Simple funny",
      text: "Pray for me 😂",
      why: "Very short, dramatic, and easy to send."
    }
  ],
  caution: "Demo mode: add OPENAI_API_KEY to get real AI-generated replies."
};

function clean(input: string | undefined, maxLength: number) {
  return (input || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function normalizeModelOutput(value: unknown) {
  if (!value || typeof value !== 'object') {
    return demoReplies;
  }

  const data = value as Partial<typeof demoReplies>;
  const replies = Array.isArray(data.replies)
    ? data.replies
        .filter((reply) => reply && typeof reply === 'object')
        .slice(0, 6)
        .map((reply) => {
          const item = reply as { label?: unknown; text?: unknown; why?: unknown };
          return {
            label: typeof item.label === 'string' ? item.label.slice(0, 40) : 'Reply',
            text: typeof item.text === 'string' ? item.text.slice(0, 300) : '',
            why: typeof item.why === 'string' ? item.why.slice(0, 220) : '',
          };
        })
        .filter((reply) => reply.text)
    : [];

  return {
    vibe: typeof data.vibe === 'string' ? data.vibe.slice(0, 360) : 'Here is a quick read of the situation.',
    strategy: typeof data.strategy === 'string' ? data.strategy.slice(0, 260) : 'Keep it natural, short, and context-aware.',
    replies: replies.length ? replies : demoReplies.replies,
    caution: typeof data.caution === 'string' ? data.caution.slice(0, 260) : '',
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const message = clean(body.message, MAX_MESSAGE_LENGTH);
    const relationship = clean(body.relationship, 80) || 'Friend';
    const tone = clean(body.tone, 80) || 'Witty';
    const length = clean(body.length, 80) || 'Short';
    const voice = clean(body.voice, 80) || 'Balanced';
    const humorLevel = clean(body.humorLevel, 80) || 'Playful';
    const context = clean(body.context, MAX_CONTEXT_LENGTH) || 'None';

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(demoReplies);
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are Quick on My Feet, an AI conversation coach. Generate copy-ready replies that are natural, socially sharp, funny when requested, and not cringe. Always return valid JSON.',
        },
        {
          role: 'user',
          content: `
Incoming message:
${message}

Relationship:
${relationship}

Desired tone:
${tone}

Desired length:
${length}

User voice preset:
${voice}

Humor level:
${humorLevel}

Extra context:
${context}

Voice preset guidance:
- Balanced: broadly natural, safe, and usable.
- Casual: relaxed, simple, and conversational.
- Confident: direct, self-assured, but not arrogant.
- Dry humor: understated, clever, and low-drama.
- Warm: kind, emotionally intelligent, and reassuring.
- Korean-American: natural American English with slightly warm, modest, non-cringe phrasing.
- Executive: concise, polished, and professional.

Humor level guidance:
- Safe: light, natural, low-risk humor.
- Playful: witty but still normal.
- Funnier: stronger punchlines, more unexpected wording, but still sendable.
- Meme / absurd: short, dramatic, mock-heroic, internet-style one-liners.
- Pop-culture: use broad, recognizable references such as movies, quests, missions, final boss, superheroes, space, or fantasy, but do not force obscure references.

For funny social moments, prefer this structure:
1. Recognize the everyday situation.
2. Reframe it as a tiny dramatic mission, quest, crisis, boss battle, space opera, or survival moment.
3. Keep it extremely short.
4. Add an emoji only when it improves the joke.

Examples of the target funny level:
- "May the Force be with me 😂"
- "Tell my story if I don’t make it back."
- "Going dark. This is not a drill."
- "I’m entering the final boss level."
- "Pray for me 😂"

Output requirements:
- Return only valid JSON.
- No Markdown.
- Generate exactly 5 reply options.
- Replies must be realistic for texting or DMs.
- Avoid manipulation, harassment, insults, hate, sexual pressure, or pickup-artist language.
- If the incoming message seems tense, make replies safer and warmer.
- Include a clear vibe read and response strategy.
- Make "Less cringe" tone very plain, natural, and understated.
- For Meme / absurd or Pop-culture humor, at least 3 replies should be short one-liners with a surprising dramatic reframe.

JSON shape:
{
  "vibe": "1-2 sentences explaining likely intent/tone of the incoming message.",
  "strategy": "1 sentence recommendation for how to respond.",
  "replies": [
    {
      "label": "Short label",
      "text": "The exact reply the user can send",
      "why": "Brief reason this works"
    }
  ],
  "caution": "Optional caution if needed, otherwise empty string"
}
`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: humorLevel.includes('Meme') || humorLevel.includes('Pop') ? 1.05 : 0.88,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No response generated.' }, { status: 500 });
    }

    return NextResponse.json(normalizeModelOutput(JSON.parse(content)));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate replies. Check the API key, model name, or server logs.' },
      { status: 500 }
    );
  }
}
