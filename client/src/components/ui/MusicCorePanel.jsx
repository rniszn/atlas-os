const CURATED_TRACKS = [
  {
    id: "_4kHxtiuML0",
    title: "Focus Music for Work and Studying, Background Music for Concentration, Study Music",
    category: "Focus",
    url: "https://www.youtube.com/watch?v=_4kHxtiuML0"
  },
  {
    id: "oPVte6aMprI",
    title: "Deep Focus - Music For Studying, Concentration and Work",
    category: "Deep Focus",
    url: "https://www.youtube.com/watch?v=oPVte6aMprI"
  },
  {
    id: "lkkGlVWvkLk",
    title: "Intense Study - 40Hz Gamma Binaural Beats to Increase Productivity and Focus",
    category: "Binaural Beats",
    url: "https://www.youtube.com/watch?v=lkkGlVWvkLk"
  },
  {
    id: "WHqbqzqeskw",
    title: "You Are Solving The Impossible | Interstellar Soundtrack",
    category: "Cinematic",
    url: "https://www.youtube.com/watch?v=WHqbqzqeskw"
  }
];

export default function MusicCorePanel() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-wide text-emerald-300">Audio Core</h2>
        <p className="mt-1 text-xs text-slate-400">
          Select a curated spatial mix optimized for deep cognitive endurance and zero distraction. Links open externally to minimize main-thread rendering lag on the WebGL canvas.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-3">
          {CURATED_TRACKS.map((track) => (
            <div
              key={track.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md transition-all hover:border-emerald-500/30 hover:bg-slate-800/50"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${track.id}/mqdefault.jpg`}
                  alt={track.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>
              
              <div className="p-3">
                <div className="mb-2">
                  <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    {track.category}
                  </span>
                </div>
                <h3 className="mb-3 text-sm font-medium text-slate-100 line-clamp-2">
                  {track.title}
                </h3>
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/20 hover:border-emerald-500/60"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Launch Stream
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
