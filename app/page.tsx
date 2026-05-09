'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Copy,
  Sparkles,
  Wand2,
  ShieldCheck,
  MessageCircle,
  Zap,
  Lock,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  HeartHandshake,
  Laugh,
} from 'lucide-react';

type Reply = {
  label: string;
  text: string;
  why?: string;
};

type GenerateResponse = {
  vibe: string;
  strategy: string;
  replies: Reply[];
  caution?: string;
};

type Scenario = {
  label: string;
  relationship: string;
  tone: string;
  length: string;
  voice: string;
  humorLevel: string;
  message: string;
  context: string;
};

const relationships = ['Friend', 'Dating / crush', 'Coworker', 'Boss', 'Group chat', 'Networking'];
const tones = ['Witty', 'Funny', 'Flirty', 'Warm', 'Professional', 'Soft no', 'Comeback', 'Less cringe'];
const lengths = ['Short', 'Medium', 'One-liner'];
const voices = ['Balanced', 'Casual', 'Confident', 'Dry humor', 'Warm', 'Korean-American', 'Executive'];
const humorLevels = ['Safe', 'Playful', 'Funnier', 'Meme / absurd', 'Pop-culture'];
const feedbackOptions = ['Good', 'Too cringe', 'Too long', 'Not my style'];

const scenarios: Scenario[] = [
  {
    label: 'Bathroom emergency',
    relationship: 'Friend',
    tone: 'Funny',
    length: 'One-liner',
    voice: 'Casual',
    humorLevel: 'Pop-culture',
    message: 'I have to go to the restroom bad lol',
    context: 'Make it dramatic and funny like: May the Force be with me 😂',
  },
  {
    label: 'Friend teasing you',
    relationship: 'Friend',
    tone: 'Witty',
    length: 'Short',
    voice: 'Casual',
    humorLevel: 'Playful',
    message: 'You disappeared again lol',
    context: 'I was busy but want to keep it playful.',
  },
  {
    label: 'Dating app banter',
    relationship: 'Dating / crush',
    tone: 'Flirty',
    length: 'One-liner',
    voice: 'Confident',
    humorLevel: 'Playful',
    message: 'Are you always this busy or just ignoring me?',
    context: 'Keep it confident, playful, and not too much.',
  },
  {
    label: 'Work DM',
    relationship: 'Coworker',
    tone: 'Professional',
    length: 'Short',
    voice: 'Executive',
    humorLevel: 'Safe',
    message: 'Can you send me the update by tonight?',
    context: 'I can send a partial update today and full version tomorrow.',
  },
  {
    label: 'Group chat roast',
    relationship: 'Group chat',
    tone: 'Comeback',
    length: 'One-liner',
    voice: 'Dry humor',
    humorLevel: 'Meme / absurd',
    message: 'Lol okay, Mr. Corporate Strategy',
    context: 'Make it funny but not mean.',
  },
];

const benefits = [
  'Reads the vibe before replying',
  'Gives multiple levels of boldness',
  'Keeps replies natural, short, and usable',
  'Can go from safe to meme-level funny',
];

export default function Home() {
  const [message, setMessage] = useState(scenarios[0].message);
  const [relationship, setRelationship] = useState(scenarios[0].relationship);
  const [tone, setTone] = useState(scenarios[0].tone);
  const [length, setLength] = useState(scenarios[0].length);
  const [voice, setVoice] = useState(scenarios[0].voice);
  const [humorLevel, setHumorLevel] = useState(scenarios[0].humorLevel);
  const [context, setContext] = useState(scenarios[0].context);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [error, setError] = useState('');

  const canGenerate = useMemo(() => message.trim().length > 0, [message]);

  function loadScenario(scenario: Scenario) {
    setMessage(scenario.message);
    setRelationship(scenario.relationship);
    setTone(scenario.tone);
    setLength(scenario.length);
    setVoice(scenario.voice);
    setHumorLevel(scenario.humorLevel);
    setContext(scenario.context);
    setResult(null);
    setError('');
    setCopied(null);
    setFeedback('');
    setFeedbackSaved(false);
  }

  async function generateReplies(nextTone?: string, nextHumorLevel?: string) {
    if (!canGenerate) return;
    const selectedTone = nextTone || tone;
    const selectedHumorLevel = nextHumorLevel || humorLevel;

    setLoading(true);
    setError('');
    setCopied(null);
    setFeedback('');
    setFeedbackSaved(false);

    try {
      const res = await fetch('/api/generate-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          relationship,
          tone: selectedTone,
          length,
          voice,
          humorLevel: selectedHumorLevel,
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong.');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1400);
  }

  function saveFeedback(value: string) {
    setFeedback(value);
    setFeedbackSaved(true);

    const payload = {
      feedback: value,
      message,
      relationship,
      tone,
      length,
      voice,
      humorLevel,
      createdAt: new Date().toISOString(),
      replies: result?.replies?.map((reply) => reply.text) || [],
    };

    try {
      const current = JSON.parse(localStorage.getItem('qomf-feedback') || '[]') as unknown[];
      localStorage.setItem('qomf-feedback', JSON.stringify([payload, ...current].slice(0, 50)));
    } catch {
      localStorage.setItem('qomf-feedback', JSON.stringify([payload]));
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur md:p-8">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
              <Zap className="h-4 w-4" />
              MVP v0.4 humor
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <Lock className="h-4 w-4" />
              No chat history saved in MVP
            </div>
          </div>

          <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Be quick on your feet in any text conversation.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Paste a text, DM, or awkward message. Get a quick read of the vibe and copy-ready replies — from safe and natural to meme-level funny.
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {benefit}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">What did they say?</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-32 resize-none rounded-3xl border border-slate-200 bg-white p-4 text-base outline-none ring-blue-500/20 transition focus:border-blue-400 focus:ring-4"
                placeholder="Paste the message here..."
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.label}
                  onClick={() => loadScenario(scenario)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  {scenario.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <SelectCard label="Relationship" value={relationship} setValue={setRelationship} options={relationships} />
              <SelectCard label="Tone" value={tone} setValue={setTone} options={tones} />
              <SelectCard label="Length" value={length} setValue={setLength} options={lengths} />
              <SelectCard label="Voice" value={voice} setValue={setVoice} options={voices} />
              <SelectCard label="Humor level" value={humorLevel} setValue={setHumorLevel} options={humorLevels} />
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Optional context</span>
              <input
                value={context}
                onChange={(event) => setContext(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white p-4 outline-none ring-blue-500/20 transition focus:border-blue-400 focus:ring-4"
                placeholder="e.g., Make it dramatic like May the Force be with me 😂"
              />
            </label>

            <button
              disabled={!canGenerate || loading}
              onClick={() => generateReplies()}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Wand2 className="h-5 w-5 animate-spin" />
                  Thinking of something smooth...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate replies
                </>
              )}
            </button>

            {result && (
              <div className="grid gap-2 sm:grid-cols-4">
                <button
                  onClick={() => {
                    setTone('Less cringe');
                    generateReplies('Less cringe');
                  }}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Less cringe
                </button>
                <button
                  onClick={() => {
                    setTone('Witty');
                    setHumorLevel('Funnier');
                    generateReplies('Witty', 'Funnier');
                  }}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try wittier
                </button>
                <button
                  onClick={() => {
                    setTone('Warm');
                    generateReplies('Warm');
                  }}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <HeartHandshake className="h-4 w-4" />
                  Make warmer
                </button>
                <button
                  onClick={() => {
                    setTone('Funny');
                    setHumorLevel('Meme / absurd');
                    generateReplies('Funny', 'Meme / absurd');
                  }}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <Laugh className="h-4 w-4" />
                  Make it funnier
                </button>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-soft md:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-200">
              <MessageCircle className="h-4 w-4" />
              Conversation read
            </div>
            <h2 className="mt-4 text-2xl font-black">What’s the vibe?</h2>
            <p className="mt-3 min-h-16 text-slate-300">
              {result?.vibe || 'Generate replies to see the likely intent, safest strategy, and best response options.'}
            </p>
            {result?.strategy && (
              <div className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                  Recommended strategy
                </div>
                <p className="text-sm leading-6 text-slate-200">{result.strategy}</p>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur md:p-8">
            <h2 className="text-2xl font-black text-slate-950">Reply options</h2>
            <p className="mt-2 text-sm text-slate-500">Pick the one that sounds most like you, then copy.</p>

            <div className="mt-5 grid gap-4">
              {result?.replies?.length ? (
                result.replies.map((reply, index) => (
                  <article key={`${reply.label}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                        {reply.label}
                      </span>
                      <button
                        onClick={() => copyText(reply.text)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Copy className="h-4 w-4" />
                        {copied === reply.text ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-lg font-semibold leading-8 text-slate-950">{reply.text}</p>
                    {reply.why && <p className="mt-3 text-sm leading-6 text-slate-500">{reply.why}</p>}
                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                  Your reply options will appear here.
                </div>
              )}
            </div>

            {result?.replies?.length ? (
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-700">How useful were these?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {feedbackOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => saveFeedback(option)}
                      className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                        feedback === option
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {feedbackSaved && (
                  <p className="mt-3 text-xs font-medium text-emerald-700">
                    Saved locally in this browser for MVP testing.
                  </p>
                )}
              </div>
            ) : null}

            {result?.caution && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                {result.caution}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/70 p-5 text-sm leading-6 text-slate-500 shadow-sm">
            <strong className="text-slate-800">Privacy note:</strong> In this MVP, messages are sent to the app server only to generate replies. The app does not include login, database storage, or conversation history. <Link href="/privacy" className="font-bold text-slate-800 underline">Read privacy baseline</Link>.
          </div>
        </div>
      </section>
    </main>
  );
}

function SelectCard({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white p-4 outline-none ring-blue-500/20 transition focus:border-blue-400 focus:ring-4"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
