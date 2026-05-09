'use client';

import { useMemo, useState } from 'react';
import { Copy, Sparkles, Wand2, ShieldCheck, MessageCircle, Zap } from 'lucide-react';

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

const relationships = ['Friend', 'Dating / crush', 'Coworker', 'Boss', 'Group chat', 'Networking'];
const tones = ['Witty', 'Funny', 'Flirty', 'Warm', 'Professional', 'Soft no', 'Comeback', 'Less cringe'];
const lengths = ['Short', 'Medium', 'One-liner'];

const examples = [
  'You disappeared again lol',
  'Are you always this busy or just ignoring me?',
  'Can you send me the update by tonight?',
  'Lol okay, Mr. Corporate Strategy',
];

export default function Home() {
  const [message, setMessage] = useState('You disappeared again lol');
  const [relationship, setRelationship] = useState('Friend');
  const [tone, setTone] = useState('Witty');
  const [length, setLength] = useState('Short');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const canGenerate = useMemo(() => message.trim().length > 0, [message]);

  async function generateReplies() {
    if (!canGenerate) return;
    setLoading(true);
    setError('');
    setCopied(null);

    try {
      const res = await fetch('/api/generate-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, relationship, tone, length, context }),
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

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur md:p-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
            <Zap className="h-4 w-4" />
            MVP v0.1
          </div>

          <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Never freeze in a conversation again.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Paste a text, DM, or awkward message. Get witty, natural replies that sound sharp — not cringe.
          </p>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">What did they say?</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-32 resize-none rounded-3xl border border-slate-200 bg-white p-4 text-base outline-none ring-blue-500/20 transition focus:border-blue-400 focus:ring-4"
                placeholder="Paste the message here..."
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  onClick={() => setMessage(example)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  {example}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <SelectCard label="Relationship" value={relationship} setValue={setRelationship} options={relationships} />
              <SelectCard label="Tone" value={tone} setValue={setTone} options={tones} />
              <SelectCard label="Length" value={length} setValue={setLength} options={lengths} />
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Optional context</span>
              <input
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white p-4 outline-none ring-blue-500/20 transition focus:border-blue-400 focus:ring-4"
                placeholder="e.g., I was actually busy, but I want to keep it playful"
              />
            </label>

            <button
              disabled={!canGenerate || loading}
              onClick={generateReplies}
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

            {result?.caution && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                {result.caution}
              </div>
            )}
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
        onChange={(e) => setValue(e.target.value)}
        className="rounded-2xl border border-slate-200 bg-white p-4 outline-none ring-blue-500/20 transition focus:border-blue-400 focus:ring-4"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
