import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type RequestBody = {
  message?: string;
  relationship?: string;
  tone?: string;
  length?: string;
  context?: string;
};

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
    }
  ],
  caution: "Demo mode: add OPENAI_API_KEY to get real AI-generated replies."
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(demoReplies);
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are Quick on My Feet, an AI conversation coach.

Goal:
Help the user reply in a way that is natural, socially sharp, witty when appropriate, and not cringe.

Input:
- Incoming message: "${message}"
- Relationship: "${body.relationship || 'Friend'}"
- Desired tone: "${body.tone || 'Witty'}"
- Desired length: "${body.length || 'Short'}"
- Extra context: "${body.context || 'None'}"

Rules:
- Do not be generic.
- Do not be overly dramatic.
- Avoid cringe, pickup-artist language, manipulation, insults, or mean humor.
- Keep replies realistic for actual texting.
- If the situation seems sensitive, choose safer wording.
- Return only valid JSON. No Markdown.

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

Generate 5 reply options.
`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You generate high-quality text-message replies. You always return valid JSON and avoid unsafe, harassing, manipulative, or hateful content.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.85,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No response generated.' }, { status: 500 });
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate replies. Check server logs and API key.' },
      { status: 500 }
    );
  }
}
