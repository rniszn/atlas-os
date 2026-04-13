import { useEffect } from 'react';
import { useAtlasStore } from '../../store/useAtlasStore';
import AIOraclePanel from './AIOraclePanel';
import MusicCorePanel from './MusicCorePanel';
import CareerPanel from './CareerPanel';
import CurriculumPanel from './CurriculumPanel';
import ZenPanel from './ZenPanel';
import NexusPanel from './NexusPanel';
import { X } from 'lucide-react';

const titles = {
  ai: 'Neural channel',
  music: 'Sonic field',
  career: 'Career opportunities',
  curriculum: 'Learning path',
  zen: 'Focus sanctuary',
  nexus: 'Collaboration hub',
};

export default function ModuleDrawer() {
  const activeModule = useAtlasStore((s) => s.activeModule);
  const closeModule = useAtlasStore((s) => s.closeModule);
  const setUiHover = useAtlasStore((s) => s.setUiHover);

  // Simple wheel event handling with increased sensitivity
  useEffect(() => {
    const sidebarContent = document.querySelector('.sidebar-content');
    if (!sidebarContent) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Increased sensitivity multiplier
      const sensitivity = 2.0;
      sidebarContent.scrollTop += e.deltaY * sensitivity;
    };

    sidebarContent.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      sidebarContent.removeEventListener('wheel', handleWheel);
    };
  }, [activeModule]);

  if (!activeModule || activeModule === 'tasks') return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        onClick={closeModule}
        onMouseEnter={() => setUiHover(true)}
        onMouseLeave={() => setUiHover(false)}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity"
      />
      <aside className="animate-drawer-in fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/[0.12] bg-[rgba(2,6,23,0.55)] shadow-[0_0_0_1px_rgba(167,139,250,0.1),-24px_0_80px_rgba(0,0,0,0.65)] backdrop-blur-3xl backdrop-saturate-150">
        <header className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-violet-400/80">
              Project ATLAS
            </p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-white">{titles[activeModule]}</h1>
          </div>
          <button
            type="button"
            data-atlas-magnetic
            onClick={closeModule}
            onMouseEnter={() => setUiHover(true)}
            onMouseLeave={() => setUiHover(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-violet-100"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>
        <div className="sidebar-content min-h-0 flex-1 overflow-y-scroll overflow-x-hidden px-6 py-5" style={{ scrollBehavior: 'smooth' }}>
          {activeModule === 'ai' && <AIOraclePanel />}
          {activeModule === 'music' && <MusicCorePanel />}
          {activeModule === 'career' && <CareerPanel />}
          {activeModule === 'curriculum' && <CurriculumPanel />}
          {activeModule === 'zen' && <ZenPanel />}
          {activeModule === 'nexus' && <NexusPanel />}
        </div>
      </aside>
    </>
  );
}
