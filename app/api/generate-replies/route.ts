import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type RequestBody = {
  message?: string;
  relationship?: string;
  tone?: string;
  length?: string;
  voice?: string;
  context?: string;
};

const MAX_MESSAGE_LENGTH = 1600;
const MAX_CONTEXT_LENGTH = 600;

const demoReplies = {
  vibe: "They are lightly teasing you. It probably does not require a heavy apology. A playful answer is safer than over-explaining.",
  strategy: "Acknowledge the tease, keep it light, and make yourself look self-aware rather than defensive.",
  replies: [
    {
      label: "Safe witty",
      text: "Haha fair. I went into full ghost mode for a second.",
      why: "Owns it without making the conversation too serious."
    },
    {
      label: "Playful",
      text: "I wasn’t disappearing, I was buffering.",
      why: "Light joke, easy to continue the conversation."
    },
    {
      label: "Confident",
      text: "I call it creating demand through scarcity.",
      why: "A little cheeky, but still friendly."
    },
    {
      label: "Warm",
      text: "Guilty. I’m back now though — what did I miss?",
      why: "Good if you want to reconnect smoothly."
    },
    {
      label: "Less cringe",
      text: "Fair call. I’m back now.",
      why: "Simple, natural, and hard to misread."
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
            'You are Quick on My Feet, an AI conversation coach. Generate copy-ready replies that are natural, socially sharp, and not cringe. Always return valid JSON.',
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

Output requirements:
- Return only valid JSON.
- No Markdown.
- Generate exactly 5 reply options.
- Replies must be realistic for texting or DMs.
- Avoid manipulation, harassment, insults, hate, sexual pressure, or pickup-artist language.
- If the incoming message seems tense, make replies safer and warmer.
- Include a clear vibe read and response strategy.
- Make "Less cringe" tone very plain, natural, and understated.

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
      temperature: 0.82,
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
