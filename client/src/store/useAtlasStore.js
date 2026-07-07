import { create } from 'zustand';
import { fetchJson } from '../lib/api.js';

/**
 * @typedef {'tasks' | 'ai' | 'music' | 'career' | 'curriculum' | 'zen' | 'tracker' | null} ActiveModule
 */

export const useAtlasStore = create((set, get) => ({
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

  /** Career / Jobs */
  jobs: [],
  jobsLoading: false,
  jobsError: null,

  fetchJobs: async () => {
    set({ jobsLoading: true, jobsError: null });
    try {
      const jobs = await fetchJson('/jobs');
      set({ jobs, jobsLoading: false });
    } catch (err) {
      set({ jobsLoading: false, jobsError: err.message || 'Failed to load jobs' });
    }
  },

  addJob: async ({ role, company, location }) => {
    const job = await fetchJson('/jobs', {
      method: 'POST',
      body: JSON.stringify({ role, company, location }),
    });
    set((state) => ({ jobs: [job, ...state.jobs] }));
    return job;
  },

  updateJobStatus: async (id, status) => {
    const prev = get().jobs;
    set({ jobs: prev.map((j) => (j._id === id ? { ...j, status } : j)) });
    try {
      const updated = await fetchJson(`/jobs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      set((state) => ({
        jobs: state.jobs.map((j) => (j._id === id ? updated : j)),
      }));
      return updated;
    } catch (err) {
      set({ jobs: prev, jobsError: err.message || 'Failed to update job' });
      throw err;
    }
  },

  deleteJob: async (id) => {
    const prev = get().jobs;
    set({ jobs: prev.filter((j) => j._id !== id) });
    try {
      await fetchJson(`/jobs/${id}`, { method: 'DELETE' });
    } catch (err) {
      set({ jobs: prev, jobsError: err.message || 'Failed to delete job' });
      throw err;
    }
  },

  /** Curriculum / Tracks */
  tracks: [],
  tracksLoading: false,
  tracksError: null,

  fetchTracks: async () => {
    set({ tracksLoading: true, tracksError: null });
    try {
      const tracks = await fetchJson('/tracks');
      set({ tracks, tracksLoading: false });
    } catch (err) {
      set({ tracksLoading: false, tracksError: err.message || 'Failed to load tracks' });
    }
  },

  addTrack: async (name) => {
    const track = await fetchJson('/tracks', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    set((state) => ({ tracks: [...state.tracks, track] }));
    return track;
  },

  addSkillToTrack: async (trackId, name) => {
    const track = await fetchJson(`/tracks/${trackId}/skills`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    set((state) => ({
      tracks: state.tracks.map((t) => (t._id === trackId ? track : t)),
    }));
    return track;
  },

  toggleSkillCompleted: async (trackId, skillId, isCompleted) => {
    const prev = get().tracks;
    set({
      tracks: prev.map((t) => {
        if (t._id !== trackId) return t;
        return {
          ...t,
          skills: t.skills.map((s) =>
            s._id === skillId ? { ...s, isCompleted: isCompleted ?? !s.isCompleted } : s
          ),
        };
      }),
    });
    try {
      const track = await fetchJson(`/tracks/${trackId}/skills/${skillId}`, {
        method: 'PATCH',
        body: JSON.stringify(
          isCompleted !== undefined ? { isCompleted } : {}
        ),
      });
      set((state) => ({
        tracks: state.tracks.map((t) => (t._id === trackId ? track : t)),
      }));
      return track;
    } catch (err) {
      set({ tracks: prev, tracksError: err.message || 'Failed to update skill' });
      throw err;
    }
  },

  deleteTrack: async (id) => {
    const prev = get().tracks;
    set({ tracks: prev.filter((t) => t._id !== id) });
    try {
      await fetchJson(`/tracks/${id}`, { method: 'DELETE' });
    } catch (err) {
      set({ tracks: prev, tracksError: err.message || 'Failed to delete track' });
      throw err;
    }
  },

  deleteSkillFromTrack: async (trackId, skillId) => {
    const prev = get().tracks;
    set({
      tracks: prev.map((t) => {
        if (t._id !== trackId) return t;
        return { ...t, skills: t.skills.filter((s) => s._id !== skillId) };
      }),
    });
    try {
      const track = await fetchJson(`/tracks/${trackId}/skills/${skillId}`, {
        method: 'DELETE',
      });
      set((state) => ({
        tracks: state.tracks.map((t) => (t._id === trackId ? track : t)),
      }));
      return track;
    } catch (err) {
      set({ tracks: prev, tracksError: err.message || 'Failed to delete skill' });
      throw err;
    }
  },
}));
