'use client';

import { useEffect, useState } from 'react';

type FeedbackRecord = {
  feedback: string;
  message: string;
  relationship: string;
  tone: string;
  length: string;
  voice: string;
  createdAt: string;
  replies: string[];
};

export default function FeedbackPage() {
  const [records, setRecords] = useState<FeedbackRecord[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('qomf-feedback') || '[]') as FeedbackRecord[];
      setRecords(stored);
    } catch {
      setRecords([]);
    }
  }, []);

  function clearFeedback() {
    localStorage.removeItem('qomf-feedback');
    setRecords([]);
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <a href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900">
              ← Back to app
            </a>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950">
              Local feedback log
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              This page reads only from this browser’s localStorage. It is useful for MVP testing before adding real analytics.
            </p>
          </div>

          <button
            onClick={clearFeedback}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Clear local feedback
          </button>
        </div>

        <div className="mt-8 grid gap-4">
          {records.length ? (
            records.map((record, index) => (
              <article key={`${record.createdAt}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {record.feedback}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {record.relationship}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {record.tone}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {record.voice}
                  </span>
                </div>

                <p className="mt-4 text-sm font-bold text-slate-500">Incoming message</p>
                <p className="mt-1 text-slate-950">{record.message}</p>

                <p className="mt-4 text-sm font-bold text-slate-500">Replies</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
                  {record.replies.map((reply, replyIndex) => (
                    <li key={`${reply}-${replyIndex}`} className="rounded-2xl bg-slate-50 p-3">
                      {reply}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs text-slate-400">{new Date(record.createdAt).toLocaleString()}</p>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              No local feedback yet. Generate replies, mark the quality, then return here.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
