export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur md:p-8">
        <a href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900">
          ← Back to app
        </a>

        <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-950">
          Privacy baseline
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Quick on My Feet is currently an MVP. The app is designed as a copy/paste reply coach with no login, no database, and no conversation history.
        </p>

        <div className="mt-8 grid gap-5 text-slate-700">
          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black text-slate-950">What is sent</h2>
            <p className="mt-2 leading-7">
              When you generate replies, the message and optional context you enter are sent to the server endpoint so the app can create response suggestions.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black text-slate-950">What is not stored in this MVP</h2>
            <p className="mt-2 leading-7">
              This MVP does not include accounts, a database, saved history, or long-term chat storage inside the app.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black text-slate-950">User guidance</h2>
            <p className="mt-2 leading-7">
              Do not paste highly sensitive personal, financial, medical, legal, or confidential business information into the app during MVP testing.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
