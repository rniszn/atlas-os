import { useMemo, useState } from 'react';

/**
 * Spotify only loads in iframes when the path is /embed/playlist|album|track|episode/ID.
 */
function normalizeSpotifyEmbedSrc(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s) return null;

  if (s.includes('open.spotify.com/embed/')) {
    try {
      const u = new URL(s);
      if (!u.hostname.endsWith('open.spotify.com')) return s;
      return u.toString();
    } catch {
      return s;
    }
  }

  const patterns = [
    [/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/, 'playlist'],
    [/open\.spotify\.com\/album\/([a-zA-Z0-9]+)/, 'album'],
    [/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/, 'track'],
    [/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/, 'episode'],
  ];

  for (const [re, kind] of patterns) {
    const m = s.match(re);
    if (m) {
      return `https://open.spotify.com/embed/${kind}/${m[1]}`;
    }
  }

  return s;
}

function youtubeEmbedUrl(input) {
  if (!input || typeof input !== 'string') return null;
  const s = input.trim();
  if (!s) return null;
  // Already embed
  if (s.includes('youtube.com/embed/') || s.includes('youtube-nocookie.com/embed/')) {
    try {
      return new URL(s).toString();
    } catch {
      return s;
    }
  }
  // youtu.be/VIDEO
  const short = s.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  // watch?v=
  const watch = s.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return null;
}

/** Spotify editorial — may still 404 in embed for some accounts/regions. */
const SPOTIFY_FALLBACK_EMBED =
  'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LpO';

/**
 * Lofi stream — works in most browsers without Spotify login.
 * Override with VITE_YOUTUBE_FOCUS_URL (watch URL or embed URL).
 */
const YOUTUBE_DEFAULT = 'https://www.youtube.com/embed/jfKfPfyJRdk';

export default function MusicCorePanel() {
  const [source, setSource] = useState('youtube');

  const fromEnvSpotify =
    import.meta.env.VITE_SPOTIFY_PLAYLIST_URL ||
    import.meta.env.VITE_SPOTIFY_EMBED_URL ||
    '';

  const spotifyEmbed = useMemo(
    () => normalizeSpotifyEmbedSrc(fromEnvSpotify) || SPOTIFY_FALLBACK_EMBED,
    [fromEnvSpotify]
  );

  const fromEnvYt = import.meta.env.VITE_YOUTUBE_FOCUS_URL || '';
  const youtubeSrc = useMemo(
    () => youtubeEmbedUrl(fromEnvYt) || YOUTUBE_DEFAULT,
    [fromEnvYt]
  );

  const openInSpotifyHref = spotifyEmbed
    .replace('open.spotify.com/embed/', 'open.spotify.com/')
    .replace(/\?.*$/, '');

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-wide text-emerald-300">Audio Core</h2>
        <p className="mt-1 text-xs text-slate-400">
          Spotify’s embed often fails in dev (cookies, ad blockers, region). Use{' '}
          <span className="text-emerald-400/90">Stream</span> for a player that usually works, or open Spotify in the app.
        </p>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setSource('youtube')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            source === 'youtube'
              ? 'bg-emerald-500 text-slate-950'
              : 'border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Stream (YouTube)
        </button>
        <button
          type="button"
          onClick={() => setSource('spotify')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            source === 'spotify'
              ? 'bg-emerald-500 text-slate-950'
              : 'border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Spotify embed
        </button>
        <a
          href={openInSpotifyHref}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10"
        >
          Open in Spotify
        </a>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 p-2 backdrop-blur-md">
        {source === 'youtube' && (
          <>
            <iframe
              title="Focus stream"
              src={youtubeSrc}
              width="100%"
              height="100%"
              className="aspect-video min-h-[220px] w-full rounded-xl border-0 sm:min-h-[280px]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <p className="mt-2 text-center text-[11px] text-slate-500">
              Set <code className="text-emerald-400/80">VITE_YOUTUBE_FOCUS_URL</code> to your own video or playlist link.
            </p>
          </>
        )}

        {source === 'spotify' && (
          <>
            <iframe
              title="Spotify"
              src={spotifyEmbed}
              width="100%"
              height="352"
              className="w-full rounded-xl border-0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
            <p className="mt-2 text-center text-[11px] text-slate-500">
              If you see “Page not found”, Spotify blocked the embed — use{' '}
              <span className="text-slate-400">Stream</span> or{' '}
              <span className="text-slate-400">Open in Spotify</span>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
