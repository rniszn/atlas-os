import { useCallback, useEffect, useState } from 'react';
import { fetchJson } from '../../lib/api';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];

const nextStatus = (s) => {
  const i = STATUSES.indexOf(s);
  if (i < 0) return 'Pending';
  return STATUSES[(i + 1) % STATUSES.length];
};

export default function TaskPanel() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);

  const loadTasks = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchJson('/tasks')
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message || 'Cannot reach task server. Is MongoDB & API running on :5000?');
        setTasks([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed.length < 3) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    setError(null);

    fetchJson('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: trimmed, priority, tags }),
    })
      .then((created) => {
        setTasks((prev) => [created, ...prev]);
        setTitle('');
        setTagsInput('');
        setPriority('Medium');
      })
      .catch((err) => {
        setError(err.message || 'Failed to create task');
      })
      .finally(() => setSaving(false));
  };

  const handleToggleStatus = (task) => {
    const optimistic = nextStatus(task.status);
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: optimistic } : t))
    );

    fetchJson(`/tasks/${task._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: optimistic }),
    })
      .then((updated) => {
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      })
      .catch(() => {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
        setError('Failed to update status. Reverted.');
      });
  };

  const handleDelete = (task) => {
    const prevTasks = tasks;
    setTasks((tasks) => tasks.filter((t) => t._id !== task._id));

    fetchJson(`/tasks/${task._id}`, { method: 'DELETE' })
      .then(() => {})
      .catch(() => {
        setTasks(prevTasks);
        setError('Failed to delete task. Reverted.');
      });
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-wide text-cyan-300">Command Desk</h2>
        <p className="mt-1 text-xs text-slate-400">
          Tasks load from MongoDB via <code className="text-cyan-400/80">/api/tasks</code>. No mock data.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="flex shrink-0 flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md"
      >
        <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          New mission
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (min 3 characters)"
          className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm outline-none ring-cyan-400/30 placeholder:text-slate-600 focus:ring-2"
          minLength={3}
          required
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-white/10 bg-slate-950/60 px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-cyan-400/30"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="min-w-[140px] flex-1 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-cyan-400/30"
          />
        </div>
        <button
          type="submit"
          disabled={saving || title.trim().length < 3}
          className="mt-1 rounded-lg bg-cyan-500/90 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {saving ? 'Deploying…' : 'Create task'}
        </button>
      </form>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-500">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <span className="ml-3">Syncing with database…</span>
          </div>
        ) : tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No tasks yet. Create one above — data persists in MongoDB.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="rounded-xl border border-white/10 bg-slate-900/50 p-3 backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-slate-100">{task.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                      <span className="rounded bg-white/5 px-1.5 py-0.5">{task.priority}</span>
                      <span className="rounded bg-white/5 px-1.5 py-0.5">{task.status}</span>
                    </div>
                    {task.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(task)}
                      className="rounded-lg border border-violet-400/40 px-2 py-1 text-[11px] text-violet-200 hover:bg-violet-500/10"
                    >
                      Status →
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(task)}
                      className="rounded-lg border border-rose-500/40 px-2 py-1 text-[11px] text-rose-200 hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={loadTasks}
        className="shrink-0 rounded-lg border border-white/15 py-2 text-xs text-slate-300 hover:bg-white/5"
      >
        Refresh from server
      </button>
    </div>
  );
}
