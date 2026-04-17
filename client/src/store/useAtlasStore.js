import { create } from 'zustand';

/**
 * @typedef {'tasks' | 'ai' | 'music' | 'career' | 'curriculum' | 'zen' | 'nexus' | 'tracker' | null} ActiveModule
 */

export const useAtlasStore = create((set) => ({
  /** @type {ActiveModule} */
  activeModule: null,
  /** @param {ActiveModule} module */
  setActiveModule: (module) => set({ activeModule: module }),
  closeModule: () => set({ activeModule: null }),

  /** True when hovering interactive 3D meshes (custom cursor scales). */
  pointerInteractiveHover: false,
  setPointerInteractiveHover: (v) => set({ pointerInteractiveHover: Boolean(v) }),

  /** True when hovering 2D controls (desk / oracle / audio pills). */
  uiHover: false,
  setUiHover: (v) => set({ uiHover: Boolean(v) }),

  /** Time Tracker State */
  totalFocusTime: 0,
  incrementFocusTime: () => set((state) => ({ totalFocusTime: state.totalFocusTime + 1 })),
  resetFocusTime: () => set({ totalFocusTime: 0 }),

  focusLogs: [],
  addFocusLog: (log) => set((state) => ({ focusLogs: [log, ...state.focusLogs] })),
  clearFocusLogs: () => set({ focusLogs: [] }),

  isActive: true,
  setIsActive: (active) => set({ isActive: active }),

  sessionStartTime: null,
  setSessionStartTime: (time) => set({ sessionStartTime: time }),
}));
