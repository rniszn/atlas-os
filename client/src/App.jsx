import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Lenis from '@studio-freight/react-lenis';
import Experience from './components/Experience';
import HeroUI from './components/HeroUI';
import ScrollSection from './components/ScrollSection';
import CustomCursor from './components/CustomCursor';
import GlassTaskDrawer from './components/GlassTaskDrawer';
import ModuleDrawer from './components/ui/ModuleDrawer';
import { useAtlasStore } from './store/useAtlasStore';
import { useTimeTracker } from './hooks/useTimeTracker';

function FloatingNav() {
  const setActiveModule = useAtlasStore((s) => s.setActiveModule);
  const setUiHover = useAtlasStore((s) => s.setUiHover);
  const activeModule = useAtlasStore((s) => s.activeModule);

  // Disable Lenis when sidebar is open
  useEffect(() => {
    const lenis = document.querySelector('[data-lenis-prevent]');
    if (lenis) {
      if (activeModule && activeModule !== 'tasks') {
        lenis.setAttribute('data-lenis-prevent', 'true');
      } else {
        lenis.removeAttribute('data-lenis-prevent');
      }
    }
  }, [activeModule]);

  const btn =
    'rounded-full border border-white/[0.14] bg-[rgba(2,6,23,0.55)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200 shadow-lg backdrop-blur-xl transition hover:border-cyan-400/35 hover:text-cyan-100';

  return (
    <nav className="pointer-events-auto fixed right-6 top-6 z-30 flex flex-wrap justify-end gap-2 md:right-10 md:top-10">
      {[
        { id: 'tasks', label: 'Desk' },
        { id: 'ai', label: 'AI' },
        { id: 'music', label: 'Audio' },
        { id: 'career', label: 'Career' },
        { id: 'curriculum', label: 'Curriculum' },
        { id: 'zen', label: 'Zen' },
        { id: 'nexus', label: 'Nexus' },
      ].map(({ id, label }) => (
        <button
          key={id}
          type="button"
          data-atlas-magnetic
          onClick={() => setActiveModule(id)}
          onMouseEnter={() => setUiHover(true)}
          onMouseLeave={() => setUiHover(false)}
          className={btn}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const setActiveModule = useAtlasStore((s) => s.setActiveModule);
  const setPointerInteractiveHover = useAtlasStore((s) => s.setPointerInteractiveHover);

  // Initialize time tracker
  useTimeTracker();

  return (
    <Lenis
      root
      options={{
        smoothWheel: true,
        wheelMultiplier: 0.88,
        touchMultiplier: 1.15,
        lerp: 0.085,
        normalizeWheel: true,
        syncTouch: true,
      }}
      autoRaf
    >
      <div className="relative h-screen bg-[#020617] text-slate-100 antialiased overflow-hidden">
        <div className="fixed inset-0 z-0">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [6.8, 3.9, 8.4], fov: 40 }}
            className="h-full w-full touch-none"
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <Experience
                setActiveModule={setActiveModule}
                setPointerInteractiveHover={setPointerInteractiveHover}
              />
              <OrbitControls
                enablePan
                enableZoom
                minPolarAngle={0.2}
                maxPolarAngle={Math.PI / 2.02}
                maxDistance={24}
                minDistance={4.5}
              />
            </Suspense>
          </Canvas>
        </div>

        <HeroUI />
        <FloatingNav />

        {/* <CustomCursor /> */}
        <GlassTaskDrawer />
        <ModuleDrawer />
      </div>
      </Lenis>
  );
}
