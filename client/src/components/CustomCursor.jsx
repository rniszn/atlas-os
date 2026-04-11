import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAtlasStore } from '../store/useAtlasStore';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pointerInteractiveHover = useAtlasStore((s) => s.pointerInteractiveHover);
  const uiHover = useAtlasStore((s) => s.uiHover);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };

    const quickDotX = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3.out' });
    const quickDotY = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3.out' });
    const quickRingX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' });
    const quickRingY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' });

    let magneticPull = { x: 0, y: 0 };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const magnets = document.querySelectorAll('[data-atlas-magnetic]');
      let best = { d: Infinity, cx: 0, cy: 0 };
      magnets.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (d < best.d) best = { d, cx, cy };
      });
      const strength = 56;
      if (best.d < strength && best.d > 0) {
        const t = 1 - best.d / strength;
        magneticPull.x = (best.cx - e.clientX) * t * 0.35;
        magneticPull.y = (best.cy - e.clientY) * t * 0.35;
      } else {
        magneticPull.x *= 0.85;
        magneticPull.y *= 0.85;
      }
    };

    let raf = 0;
    const loop = () => {
      pos.x += (target.x - pos.x + magneticPull.x) * 0.22;
      pos.y += (target.y - pos.y + magneticPull.y) * 0.22;
      quickDotX(pos.x);
      quickDotY(pos.y);
      quickRingX(pos.x);
      quickRingY(pos.y);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });

    gsap.set([dot, ring], { x: pos.x, y: pos.y, xPercent: -50, yPercent: -50 });

    document.documentElement.classList.add('atlas-cursor-on');
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.classList.remove('atlas-cursor-on');
      document.body.style.cursor = prevCursor;
    };
  }, []);

  const hover = pointerInteractiveHover || uiHover;

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;
    gsap.to(ring, {
      scale: hover ? 1.85 : 1,
      borderColor: hover ? 'rgba(34, 211, 238, 0.65)' : 'rgba(255, 255, 255, 0.22)',
      duration: 0.45,
      ease: 'power3.out',
    });
    gsap.to(dot, {
      scale: hover ? 0.45 : 0.22,
      duration: 0.35,
      ease: 'power3.out',
    });
  }, [hover]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      <div
        ref={dotRef}
        className="pointer-events-none absolute left-0 top-0 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-0 top-0 h-10 w-10 rounded-full border border-cyan-400/35"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
