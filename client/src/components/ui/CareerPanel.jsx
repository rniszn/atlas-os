import { useState } from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';

const mockInternships = [
  {
    id: 1,
    company: 'TechCorp Solutions',
    position: 'Frontend Developer Intern',
    location: 'San Francisco, CA',
    duration: 'Summer 2024',
    status: 'Applied',
    appliedDate: '2024-03-15',
    logo: 'TC'
  },
  {
    id: 2,
    company: 'DataFlow Analytics',
    position: 'React Developer Intern',
    location: 'Remote',
    duration: 'Fall 2024',
    status: 'Interviewing',
    appliedDate: '2024-03-10',
    logo: 'DF'
  },
  {
    id: 3,
    company: 'CloudNine Systems',
    position: 'Full Stack Intern',
    location: 'New York, NY',
    duration: 'Summer 2024',
    status: 'Rejected',
    appliedDate: '2024-03-01',
    logo: 'CN'
  },
  {
    id: 4,
    company: 'Innovation Labs',
    position: 'UI/UX Developer Intern',
    location: 'Austin, TX',
    duration: 'Fall 2024',
    status: 'Applied',
    appliedDate: '2024-03-18',
    logo: 'IL'
  },
  {
    id: 5,
    company: 'NextGen AI',
    position: 'Machine Learning Intern',
    location: 'Seattle, WA',
    duration: 'Summer 2024',
    status: 'Applied',
    appliedDate: '2024-03-20',
    logo: 'NG'
  }
];

const statusColors = {
  Applied: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Interviewing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  Accepted: 'bg-green-500/20 text-green-300 border-green-500/30'
};

export default function CareerPanel() {
  const [filter, setFilter] = useState('All');
  const filteredInternships = filter === 'All' 
    ? mockInternships 
    : mockInternships.filter(internship => internship.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Career Opportunities</h2>
          <p className="text-sm text-slate-400">Track your internship applications and interviews</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Applied', 'Interviewing', 'Rejected'].map((status) => (
            <button
              key={status}
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

      <div className="space-y-3">
        {filteredInternships.map((internship) => (
          <div
            key={internship.id}
            className="group relative rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] p-4 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-[rgba(139,92,246,0.05)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30">
                  <span className="text-sm font-bold text-violet-300">{internship.logo}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {internship.position}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[internship.status]}`}>
                      {internship.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-300 mb-2">{internship.company}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{internship.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{internship.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      <span>Applied {internship.appliedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-violet-500/10 hover:text-violet-300 hover:border-violet-500/30 transition-all">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white mb-2">Application Stats</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-300">{mockInternships.length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-300">
              {mockInternships.filter(i => i.status === 'Applied').length}
            </div>
            <div className="text-xs text-slate-500">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-300">
              {mockInternships.filter(i => i.status === 'Interviewing').length}
            </div>
            <div className="text-xs text-slate-500">Interviewing</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-300">
              {mockInternships.filter(i => i.status === 'Rejected').length}
            </div>
            <div className="text-xs text-slate-500">Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
