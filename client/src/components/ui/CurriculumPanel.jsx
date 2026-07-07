import { useEffect, useState } from 'react';
import { Code, BookOpen, Zap, Award, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useAtlasStore } from '../../store/useAtlasStore';

const TRACK_THEMES = [
  { icon: Code, color: 'blue' },
  { icon: BookOpen, color: 'green' },
  { icon: Zap, color: 'violet' },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    progress: 'bg-blue-500',
    icon: 'text-blue-400',
  },
  green: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-300',
    progress: 'bg-green-500',
    icon: 'text-green-400',
  },
  violet: {
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/30',
    text: 'text-violet-300',
    progress: 'bg-violet-500',
    icon: 'text-violet-400',
  },
};

function trackProgress(skills) {
  if (!skills?.length) return 0;
  const completed = skills.filter((s) => s.isCompleted).length;
  return (completed / skills.length) * 100;
}

export default function CurriculumPanel() {
  const tracks = useAtlasStore((s) => s.tracks);
  const tracksLoading = useAtlasStore((s) => s.tracksLoading);
  const tracksError = useAtlasStore((s) => s.tracksError);
  const fetchTracks = useAtlasStore((s) => s.fetchTracks);
  const addTrack = useAtlasStore((s) => s.addTrack);
  const addSkillToTrack = useAtlasStore((s) => s.addSkillToTrack);
  const toggleSkillCompleted = useAtlasStore((s) => s.toggleSkillCompleted);
  const deleteTrack = useAtlasStore((s) => s.deleteTrack);
  const deleteSkillFromTrack = useAtlasStore((s) => s.deleteSkillFromTrack);

  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [newTrackName, setNewTrackName] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [addingTrack, setAddingTrack] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [showTrackForm, setShowTrackForm] = useState(false);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    if (tracks.length > 0 && !selectedTrackId) {
      setSelectedTrackId(tracks[0]._id);
    }
    if (tracks.length > 0 && selectedTrackId && !tracks.find((t) => t._id === selectedTrackId)) {
      setSelectedTrackId(tracks[0]._id);
    }
  }, [tracks, selectedTrackId]);

  const totalSkills = tracks.reduce((acc, t) => acc + (t.skills?.length ?? 0), 0);
  const completedSkills = tracks.reduce(
    (acc, t) => acc + (t.skills?.filter((s) => s.isCompleted).length ?? 0),
    0
  );
  const overallProgress = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;

  const currentTrack = tracks.find((t) => t._id === selectedTrackId);
  const currentTrackIndex = tracks.findIndex((t) => t._id === selectedTrackId);
  const theme = TRACK_THEMES[currentTrackIndex % TRACK_THEMES.length] ?? TRACK_THEMES[0];
  const colors = colorClasses[theme.color];

  const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!newTrackName.trim()) return;
    setAddingTrack(true);
    try {
      const track = await addTrack(newTrackName.trim());
      setSelectedTrackId(track._id);
      setNewTrackName('');
      setShowTrackForm(false);
    } catch {
      // error surfaced via tracksError
    } finally {
      setAddingTrack(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim() || !selectedTrackId) return;
    setAddingSkill(true);
    try {
      await addSkillToTrack(selectedTrackId, newSkillName.trim());
      setNewSkillName('');
    } catch {
      // error surfaced via tracksError
    } finally {
      setAddingSkill(false);
    }
  };

  const handleToggleSkill = async (skillId, isCompleted) => {
    if (!selectedTrackId) return;
    try {
      await toggleSkillCompleted(selectedTrackId, skillId, !isCompleted);
    } catch {
      // optimistic rollback handled in store
    }
  };

  const handleDeleteTrack = async (trackId) => {
    try {
      await deleteTrack(trackId);
      if (selectedTrackId === trackId) {
        setSelectedTrackId(null);
      }
    } catch {
      // optimistic rollback handled in store
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!selectedTrackId) return;
    try {
      await deleteSkillFromTrack(selectedTrackId, skillId);
    } catch {
      // optimistic rollback handled in store
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Learning Path</h2>
          <p className="text-sm text-slate-400">Track your progress through the curriculum</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-violet-300">{Math.round(overallProgress)}%</div>
          <div className="text-xs text-slate-500">Overall Progress</div>
        </div>
      </div>

      <div className="p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Total Progress</span>
          <span className="text-xs text-slate-500">
            {completedSkills}/{totalSkills} skills
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tracks.map((track, index) => {
          const Icon = TRACK_THEMES[index % TRACK_THEMES.length].icon;
          const trackColors = colorClasses[TRACK_THEMES[index % TRACK_THEMES.length].color];
          const progress = trackProgress(track.skills);
          return (
            <div
              key={track._id}
              className={`group/track relative flex-1 min-w-[140px] rounded-lg border transition-all ${
                selectedTrackId === track._id
                  ? `${trackColors.bg} ${trackColors.border} ${trackColors.text}`
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedTrackId(track._id)}
                className="flex w-full flex-col gap-1 px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2 pr-5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium truncate">{track.name}</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1">
                  <div
                    className={`${trackColors.progress} h-1 rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] opacity-70">{Math.round(progress)}%</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTrack(track._id)}
                aria-label={`Delete ${track.name}`}
                className="absolute right-2 top-2 rounded p-1 text-slate-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-300 group-hover/track:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => setShowTrackForm((v) => !v)}
          className="flex items-center gap-1 px-4 py-3 rounded-lg border border-dashed border-white/15 bg-white/[0.02] text-xs font-medium text-slate-400 hover:border-violet-500/30 hover:text-violet-300 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Track
        </button>
      </div>

      {showTrackForm && (
        <form
          onSubmit={handleAddTrack}
          className="flex gap-2 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] p-3 backdrop-blur-sm"
        >
          <input
            type="text"
            value={newTrackName}
            onChange={(e) => setNewTrackName(e.target.value)}
            placeholder='e.g., "Web Technologies"'
            className="flex-1 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500/40"
          />
          <button
            type="submit"
            disabled={addingTrack || !newTrackName.trim()}
            className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-200 hover:bg-violet-500/20 disabled:opacity-50"
          >
            {addingTrack ? '…' : 'Create'}
          </button>
        </form>
      )}

      {tracksError && (
        <p className="text-sm text-red-400 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
          {tracksError}
        </p>
      )}

      {tracksLoading && tracks.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Loading tracks…</p>
      ) : !currentTrack ? (
        <p className="text-sm text-slate-500 text-center py-8">
          No tracks yet. Create your first learning path above.
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-300 truncate">{currentTrack.name}</p>
            <button
              type="button"
              onClick={() => handleDeleteTrack(currentTrack._id)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-300 transition hover:bg-red-500/20"
            >
              <Trash2 className="h-3 w-3" />
              Delete track
            </button>
          </div>

          <form
            onSubmit={handleAddSkill}
            className="flex gap-2 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] p-3 backdrop-blur-sm"
          >
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Add a new skill to this track…"
              className="flex-1 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500/40"
            />
            <button
              type="submit"
              disabled={addingSkill || !newSkillName.trim()}
              className="inline-flex items-center gap-1 rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-200 hover:bg-violet-500/20 disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              {addingSkill ? '…' : 'Add'}
            </button>
          </form>

          <div className="space-y-3">
            {currentTrack.skills?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                No skills in this track yet. Add one above.
              </p>
            ) : (
              currentTrack.skills.map((skill) => (
                <div
                  key={skill._id}
                  className={`group relative rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-[rgba(139,92,246,0.05)] ${
                    skill.isCompleted ? 'opacity-90' : 'opacity-80'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleSkill(skill._id, skill.isCompleted)}
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
                            skill.isCompleted
                              ? 'bg-green-500/20 border-green-500/40 text-green-400'
                              : `${colors.bg} ${colors.border} text-slate-500 hover:border-violet-500/40`
                          }`}
                          aria-label={skill.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {skill.isCompleted && <CheckCircle className="h-4 w-4" />}
                        </button>
                        <div className="min-w-0">
                          <h3
                            className={`font-semibold transition-colors truncate ${
                              skill.isCompleted
                                ? 'text-slate-400 line-through'
                                : 'text-white group-hover:text-violet-300'
                            }`}
                          >
                            {skill.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {skill.isCompleted ? 'Completed' : 'In Progress'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skill._id)}
                        aria-label={`Delete ${skill.name}`}
                        className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.02] p-2 text-slate-500 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 w-full bg-slate-700/50 rounded-full h-1.5">
                      <div
                        className={`${colors.progress} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: skill.isCompleted ? '100%' : '0%' }}
                      />
                    </div>

                    {skill.isCompleted && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                        <Award className="h-3 w-3" />
                        <span>Skill mastered! Keep up the great work.</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 rounded-lg border border-white/[0.08] bg-gradient-to-br from-violet-500/10 to-purple-600/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white">Current Focus</h3>
            </div>
            <p className="text-xs text-slate-300">
              Continue with{' '}
              {currentTrack.skills?.find((s) => !s.isCompleted)?.name || 'all skills completed!'}{' '}
              to advance your learning journey.
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Track progress</span>
              <span>{Math.round(trackProgress(currentTrack.skills))}%</span>
            </div>
            <div className="mt-1 w-full bg-slate-700/50 rounded-full h-1.5">
              <div
                className={`${colors.progress} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${trackProgress(currentTrack.skills)}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
