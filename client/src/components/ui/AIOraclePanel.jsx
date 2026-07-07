import { useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-lite-latest',
];

function localReply(prompt) {
  const raw = prompt.trim();
  const lower = raw.toLowerCase();
  const short = raw.length > 120 ? `${raw.slice(0, 117)}...` : raw;

  if (/^(hey|hi|hello|yo|sup|wassup|what'?s up|hola)\b/i.test(lower.trim())) {
    return "Hey - good to see you. I'm Atlas in offline tutor mode (live Gemini isn't available for this session), but I can still help with study plans, IT254, graphs, OS, or breaking a problem into steps. What do you want to tackle?";
  }

  if (
    lower.includes('graph') ||
    lower.includes('bfs') ||
    lower.includes('dfs') ||
    lower.includes('tree')
  ) {
    return `On "${short}": start by drawing the graph. For unweighted shortest path, use BFS; for exploring structure or detecting cycles, DFS often fits. Label visited nodes and write the order you visit them - that usually makes the proof or algorithm obvious.`;
  }

  if (
    lower.includes('os ') ||
    lower.includes('operating system') ||
    lower.includes('deadlock') ||
    lower.includes('thread') ||
    lower.includes('process') ||
    lower.includes('scheduling')
  ) {
    return `Re: "${short}" - separate process vs thread, then pick a lens: CPU scheduling (FCFS, SJF, RR), sync (locks, semaphores), or deadlock (four conditions + break one). If you paste the exact exam question, I can map it to one of those buckets.`;
  }

  if (
    lower.includes('it254') ||
    lower.includes('software eng') ||
    lower.includes('sprint') ||
    lower.includes('agile')
  ) {
    return `For "${short}" in a software-engineering mindset: ship in small iterations, keep interfaces stable, and put tests next to the code you change. If it's a design question, name actors, data flows, and failure modes in one paragraph each.`;
  }

  if (
    lower.includes('exam') ||
    lower.includes('study') ||
    lower.includes('revision') ||
    lower.includes('test')
  ) {
    return `You asked about "${short}". Try: (1) list 3-5 topics you must pass, (2) for each, one worked example + one trap the examiner loves, (3) a 30-minute mock where you explain out loud. Want a schedule for one subject?`;
  }

  if (lower.includes('?')) {
    return `Question: "${short}" - I don't have live Gemini right now, but here's a path: restate it in one sentence, list knowns vs unknowns, then try the smallest example (n=1 or n=2). Reply with that tiny example worked through and I'll help you generalize.`;
  }

  if (lower.includes('what is react') || lower.includes('what is react js') || lower.includes('explain react')) {
    return 'React is a JavaScript library for building user interfaces from reusable components. You describe each part of the UI as a component, React tracks state changes, and it updates the page efficiently when data changes.';
  }

  if (
    lower.includes('what is javascript') ||
    lower.includes('what is js') ||
    lower.includes('explain javascript')
  ) {
    return 'JavaScript is the programming language that powers behavior on the web. It can update page content, react to user input, call APIs, and also run outside the browser with environments like Node.js.';
  }

  if (
    lower.includes('code') ||
    lower.includes('bug') ||
    lower.includes('react') ||
    lower.includes('javascript') ||
    lower.includes('error')
  ) {
    return `About "${short}": paste the exact error, the few lines around it, and what you expected. Offline, I can still suggest: read error bottom-up, reproduce in a minimal file, and binary-search which change broke it.`;
  }

  return `You said: "${short}". Without cloud AI, here's a solid move: (1) define terms in your own words, (2) one concrete example, (3) check against your notes or slides. If this is for a specific course or topic, name it in your next message and I'll narrow the steps.`;
}

async function generateWithGemini(apiKey, userText) {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastErr = null;
  const attempts = [];

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(userText);
      const out = (await result.response).text();
      if (out?.trim()) {
        return { ok: true, text: out.trim(), model: modelName };
      }
    } catch (error) {
      lastErr = error;
      const raw = error?.message || String(error || '');
      const msg = raw.toLowerCase();
      attempts.push({ modelName, error });

      // Invalid keys and permission issues will fail on every model, so stop early.
      if (matchesAuthError(raw, msg)) {
        break;
      }
    }
  }

  return { ok: false, error: lastErr, attempts };
}

function matchesQuotaError(raw, msg) {
  return (
    raw.includes('429') ||
    msg.includes('quota') ||
    msg.includes('resource exhausted') ||
    msg.includes('rate limit')
  );
}

function matchesAuthError(raw, msg) {
  return (
    raw.includes('401') ||
    raw.includes('403') ||
    msg.includes('api key') ||
    msg.includes('permission') ||
    msg.includes('unauthorized') ||
    msg.includes('forbidden')
  );
}

function matchesNetworkError(_raw, msg) {
  return (
    msg.includes('fetch') ||
    msg.includes('network') ||
    msg.includes('failed to fetch') ||
    msg.includes('load failed')
  );
}

function matchesNotFoundError(raw, msg) {
  return raw.includes('404') || msg.includes('not found') || msg.includes('not supported');
}

function matchesHighDemandError(raw, msg) {
  return (
    raw.includes('503') ||
    msg.includes('high demand') ||
    msg.includes('service unavailable') ||
    msg.includes('temporarily unavailable')
  );
}

function pickRepresentativeError(attempts = []) {
  const errors = attempts.map((attempt) => attempt.error).filter(Boolean);
  const withMeta = errors.map((error) => {
    const raw = error?.message || String(error || '');
    return { error, raw, msg: raw.toLowerCase() };
  });

  return (
    withMeta.find(({ raw, msg }) => matchesQuotaError(raw, msg))?.error ||
    withMeta.find(({ raw, msg }) => matchesAuthError(raw, msg))?.error ||
    withMeta.find(({ raw, msg }) => matchesHighDemandError(raw, msg))?.error ||
    withMeta.find(({ raw, msg }) => matchesNetworkError(raw, msg))?.error ||
    withMeta.find(({ raw, msg }) => matchesNotFoundError(raw, msg))?.error ||
    withMeta.at(-1)?.error ||
    null
  );
}

function getOfflineNotice(error) {
  const raw = error?.message || String(error || '');
  const msg = raw.toLowerCase();

  if (!raw) {
    return 'Gemini is unavailable right now, so Atlas answered offline.';
  }
  if (matchesQuotaError(raw, msg)) {
    return 'Gemini quota or rate limits were hit, so Atlas answered offline.';
  }
  if (matchesAuthError(raw, msg)) {
    return 'Gemini rejected the configured API key, so Atlas answered offline.';
  }
  if (matchesHighDemandError(raw, msg)) {
    return 'Gemini is under heavy load right now, so Atlas answered offline.';
  }
  if (matchesNetworkError(raw, msg)) {
    return 'Gemini could not be reached over the network, so Atlas answered offline.';
  }
  if (matchesNotFoundError(raw, msg)) {
    return 'This Gemini model is not available for the current API setup, so Atlas answered offline.';
  }

  return 'Gemini is unavailable right now, so Atlas answered offline.';
}

export default function AIOraclePanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.REACT_APP_GEMINI_API_KEY;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) {
      return;
    }

    setInput('');
    setMessages((current) => [...current, { role: 'user', text }]);
    setBusy(true);

    if (!apiKey) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          notice: 'Gemini key is not configured, so Atlas answered offline.',
          text: localReply(text),
        },
      ]);
      setBusy(false);
      return;
    }

    const result = await generateWithGemini(apiKey, text);

    if (result.ok) {
      setMessages((current) => [...current, { role: 'assistant', text: result.text }]);
    } else {
      const diagnosticError = pickRepresentativeError(result.attempts);
      console.warn('[ATLAS AI] Gemini fallback:', result.attempts);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          notice: getOfflineNotice(diagnosticError),
          text: localReply(text),
        },
      ]);
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
          <p className="text-center text-sm text-slate-500">
            Ask anything - I'll answer from Gemini when possible, or offline from what
            you type.
          </p>
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
              {msg.notice && (
                <p className="mb-2 text-xs font-medium text-violet-300/90">
                  {msg.notice}
                </p>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {busy && <p className="text-center text-xs text-violet-300/80">Thinking...</p>}
        <div ref={endRef} />
      </div>

      <div className="flex shrink-0 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask the oracle..."
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
