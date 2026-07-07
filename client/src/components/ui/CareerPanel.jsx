import { useEffect, useState } from 'react';
import { Briefcase, Calendar, MapPin, Plus, Trash2 } from 'lucide-react';
import { useAtlasStore } from '../../store/useAtlasStore';

const STATUS_OPTIONS = ['Applied', 'Interviewing', 'Rejected', 'Offer'];

const statusColors = {
  Applied: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Interviewing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  Offer: 'bg-green-500/20 text-green-300 border-green-500/30',
};

function companyInitials(company) {
  return company
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CareerPanel() {
  const jobs = useAtlasStore((s) => s.jobs);
  const jobsLoading = useAtlasStore((s) => s.jobsLoading);
  const jobsError = useAtlasStore((s) => s.jobsError);
  const fetchJobs = useAtlasStore((s) => s.fetchJobs);
  const addJob = useAtlasStore((s) => s.addJob);
  const updateJobStatus = useAtlasStore((s) => s.updateJobStatus);
  const deleteJob = useAtlasStore((s) => s.deleteJob);

  const [filter, setFilter] = useState('All');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs =
    filter === 'All' ? jobs : jobs.filter((job) => job.status === filter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim() || !company.trim() || !location.trim()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await addJob({
        role: role.trim(),
        company: company.trim(),
        location: location.trim(),
      });
      setRole('');
      setCompany('');
      setLocation('');
    } catch (err) {
      setFormError(err.message || 'Failed to add application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (jobId, status) => {
    try {
      await updateJobStatus(jobId, status);
    } catch {
      // optimistic rollback handled in store
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId);
    } catch {
      // optimistic rollback handled in store
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Career Opportunities</h2>
          <p className="text-sm text-slate-400">Track your internship applications and interviews</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...STATUS_OPTIONS.filter((s) => s !== 'Offer')].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                filter === status
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] p-4 backdrop-blur-sm space-y-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400/80">
          New Application
        </p>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g., Software Engineering Summer Intern"
          className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Amazon"
            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Seattle, WA or Remote"
            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
          />
        </div>
        {formError && <p className="text-xs text-red-400">{formError}</p>}
        <button
          type="submit"
          disabled={submitting || !role.trim() || !company.trim() || !location.trim()}
          className="inline-flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-violet-200 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          {submitting ? 'Adding…' : 'Add Application'}
        </button>
      </form>

      {jobsError && (
        <p className="text-sm text-red-400 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
          {jobsError}
        </p>
      )}

      {jobsLoading && jobs.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Loading applications…</p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          {filter === 'All'
            ? 'No applications yet. Add your first one above.'
            : `No applications with status "${filter}".`}
        </p>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="group relative rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] p-4 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-[rgba(139,92,246,0.05)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30">
                  <span className="text-sm font-bold text-violet-300">
                    {companyInitials(job.company)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {job.role}
                    </h3>
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium cursor-pointer outline-none transition ${statusColors[job.status] || statusColors.Applied}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-slate-200">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm font-medium text-slate-300 mb-2">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Applied {formatDate(job.appliedDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      <span>{job.status}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(job._id)}
                  aria-label="Delete application"
                  className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.02] p-2 text-slate-500 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white mb-2">Application Stats</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-300">{jobs.length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-300">
              {jobs.filter((j) => j.status === 'Applied').length}
            </div>
            <div className="text-xs text-slate-500">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-300">
              {jobs.filter((j) => j.status === 'Interviewing').length}
            </div>
            <div className="text-xs text-slate-500">Interviewing</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-300">
              {jobs.filter((j) => j.status === 'Rejected').length}
            </div>
            <div className="text-xs text-slate-500">Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
