import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroUI() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.atlas-hero-line',
        { yPercent: 115, opacity: 0, rotateX: -12 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.35,
          ease: 'power4.out',
          stagger: 0.14,
        }
      );
      gsap.fromTo(
        '.atlas-hero-sub',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.45, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.atlas-hero-meta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.85, ease: 'power2.out' }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-0 top-0 z-20 w-full px-6 pt-8 md:px-12 md:pt-14"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-[min(92vw,56rem)]">
        <p className="atlas-hero-meta mb-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-cyan-400/90">
          Immersive student workspace
        </p>
        <div className="overflow-hidden">
          <h1
            className="atlas-hero-line font-display text-[clamp(3.2rem,14vw,8.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-white drop-shadow-[0_0_60px_rgba(34,211,238,0.15)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            ATLAS
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1
            className="atlas-hero-line font-display text-[clamp(2.4rem,10vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[0.08em] text-slate-400/95"
            style={{ transformStyle: 'preserve-3d' }}
          >
            OS
          </h1>
        </div>
        <p className="atlas-hero-sub mt-6 max-w-md text-sm font-light leading-relaxed text-slate-400 md:text-base">
          Command desk, neural tutor, and sonic focus — one spatial canvas. Scroll to descend.
        </p>
      </div>
    </div>
  );
}
