import { useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

/** Models to try in order (first available wins). */
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

/**
 * Offline “tutor” that always references the user’s message so it feels like a real reply.
 */
function localReply(prompt) {
  const raw = prompt.trim();
  const lower = raw.toLowerCase();
  const short = raw.length > 120 ? `${raw.slice(0, 117)}…` : raw;

  // Casual / greetings (must match first so “hey” / “wassup” get a real reply)
  if (/^(hey|hi|hello|yo|sup|wassup|what'?s up|hola)\b/i.test(lower.trim())) {
    return `Hey — good to see you. I’m Atlas in offline tutor mode (live Gemini isn’t available for this session), but I can still help with study plans, IT254, graphs, OS, or breaking a problem into steps. What do you want to tackle?`;
  }

  if (lower.includes('graph') || lower.includes('bfs') || lower.includes('dfs') || lower.includes('tree')) {
    return `On “${short}”: start by drawing the graph. For unweighted shortest path, use BFS; for exploring structure or detecting cycles, DFS often fits. Label visited nodes and write the order you visit them — that usually makes the proof or algorithm obvious.`;
  }

  if (
    lower.includes('os ') ||
    lower.includes('operating system') ||
    lower.includes('deadlock') ||
    lower.includes('thread') ||
    lower.includes('process') ||
    lower.includes('scheduling')
  ) {
    return `Re: “${short}” — separate process vs thread, then pick a lens: CPU scheduling (FCFS, SJF, RR), sync (locks, semaphores), or deadlock (four conditions + break one). If you paste the exact exam question, I can map it to one of those buckets.`;
  }

  if (lower.includes('it254') || lower.includes('software eng') || lower.includes('sprint') || lower.includes('agile')) {
    return `For “${short}” in a software-engineering mindset: ship in small iterations, keep interfaces stable, and put tests next to the code you change. If it’s a design question, name actors, data flows, and failure modes in one paragraph each.`;
  }

  if (lower.includes('exam') || lower.includes('study') || lower.includes('revision') || lower.includes('test')) {
    return `You asked about “${short}”. Try: (1) list 3–5 topics you must pass, (2) for each, one worked example + one trap the examiner loves, (3) a 30‑minute mock where you explain out loud. Want a schedule for one subject?`;
  }

  if (lower.includes('?')) {
    return `Question: “${short}” — I don’t have live Gemini right now, but here’s a path: restate it in one sentence, list knowns vs unknowns, then try the smallest example (n=1 or n=2). Reply with that tiny example worked through and I’ll help you generalize.`;
  }

  if (lower.includes('code') || lower.includes('bug') || lower.includes('react') || lower.includes('javascript') || lower.includes('error')) {
    return `About “${short}”: paste the exact error, the few lines around it, and what you expected. Offline, I can still suggest: read error bottom-up, reproduce in a minimal file, and binary-search which change broke it.`;
  }

  // Default: always tie to their words + concrete steps
  return `You said: “${short}”. Without cloud AI, here’s a solid move: (1) define terms in your own words, (2) one concrete example, (3) check against your notes or slides. If this is for a specific course or topic, name it in your next message and I’ll narrow the steps.`;
}

async function generateWithGemini(apiKey, userText) {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastErr = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(userText);
      const out = (await result.response).text();
      if (out?.trim()) return { ok: true, text: out.trim(), model: modelName };
    } catch (e) {
      lastErr = e;
    }
  }

  return { ok: false, error: lastErr };
}

export default function AIOraclePanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.REACT_APP_GEMINI_API_KEY;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setBusy(true);

    if (!apiKey) {
      setMessages((m) => [...m, { role: 'assistant', text: localReply(text) }]);
      setBusy(false);
      return;
    }

    const result = await generateWithGemini(apiKey, text);

    if (result.ok) {
      setMessages((m) => [...m, { role: 'assistant', text: result.text }]);
    } else {
      const msg = result.error?.message || String(result.error || '');
      const quota =
        msg.includes('429') ||
        msg.toLowerCase().includes('quota') ||
        msg.toLowerCase().includes('resource exhausted');
      const prefix = quota
        ? '*(Gemini quota exhausted on this API key — answering offline.)*\n\n'
        : '*(Couldn’t reach Gemini — answering offline.)*\n\n';
      setMessages((m) => [...m, { role: 'assistant', text: prefix + localReply(text) }]);
    }

    setBusy(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-wide text-violet-300">AI Oracle</h2>
        <p className="mt-1 text-xs text-slate-400">
          {apiKey
            ? 'Tries Gemini (several models); if quota or errors block it, Atlas answers offline using your message.'
            : 'Add VITE_GEMINI_API_KEY or REACT_APP_GEMINI_API_KEY in client/.env for cloud AI; otherwise replies stay offline.'}
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/40 p-3 backdrop-blur-md">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-500">Ask anything — I’ll answer from Gemini when possible, or offline from what you type.</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-cyan-500/25 text-cyan-50'
                  : 'bg-white/5 text-slate-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {busy && <p className="text-center text-xs text-violet-300/80">Thinking…</p>}
        <div ref={endRef} />
      </div>

      <div className="flex shrink-0 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask the oracle…"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400/40"
        />
        <button
          type="button"
          onClick={send}
          disabled={busy}
          className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-violet-400 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
