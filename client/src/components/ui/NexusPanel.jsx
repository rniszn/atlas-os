import { useState } from 'react';
import { GitBranch, GitMerge, Key, Users, Activity, Shield, Eye, EyeOff, Copy, Check } from 'lucide-react';

const mockBranches = [
  {
    id: 1,
    name: 'feature/career-module',
    author: 'rohan',
    status: 'ready',
    commits: 12,
    lastUpdated: '2 hours ago',
    conflicts: false
  },
  {
    id: 2,
    name: 'fix/zen-timer-bug',
    author: 'alex',
    status: 'in-progress',
    commits: 5,
    lastUpdated: '30 minutes ago',
    conflicts: false
  },
  {
    id: 3,
    name: 'feature/curriculum-tree',
    author: 'sarah',
    status: 'review',
    commits: 18,
    lastUpdated: '1 hour ago',
    conflicts: true
  },
  {
    id: 4,
    name: 'hotfix/nexus-security',
    author: 'mike',
    status: 'merged',
    commits: 3,
    lastUpdated: '4 hours ago',
    conflicts: false
  }
];

const mockApiKeys = [
  {
    id: 1,
    name: 'OpenAI API',
    service: 'AI Chat',
    key: 'sk-proj-abc123...def456',
    lastUsed: '5 minutes ago',
    isActive: true
  },
  {
    id: 2,
    name: 'Database Connection',
    service: 'MongoDB',
    key: 'mongodb+srv://user:pass...cluster.mongodb.net',
    lastUsed: '1 hour ago',
    isActive: true
  },
  {
    id: 3,
    name: 'Email Service',
    service: 'SendGrid',
    key: 'SG.xyz123...abc789',
    lastUsed: '2 days ago',
    isActive: false
  }
];

const statusColors = {
  'ready': 'bg-green-500/20 text-green-300 border-green-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'review': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'merged': 'bg-purple-500/20 text-purple-300 border-purple-500/30'
};

export default function NexusPanel() {
  const [showKeys, setShowKeys] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  const toggleKeyVisibility = (keyId) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text, keyId) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key) => {
    if (key.length <= 8) return key;
    return key.slice(0, 8) + '...' + key.slice(-8);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Nexus Hub</h2>
          <p className="text-sm text-slate-400">Team collaboration and secure resource management</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Activity className="h-4 w-4" />
          <span>Active Team</span>
        </div>
      </div>

      {/* Branch Management */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Active Branches</h3>
          <span className="px-2 py-1 text-xs bg-violet-500/20 text-violet-300 rounded-full">
            {mockBranches.length}
          </span>
        </div>

        <div className="space-y-3">
          {mockBranches.map((branch) => (
            <div
              key={branch.id}
              className="group relative rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] p-4 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-[rgba(139,92,246,0.05)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20 border border-violet-500/30">
                    <GitBranch className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {branch.name}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[branch.status]}`}>
                        {branch.status}
                      </span>
                      {branch.conflicts && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/20 text-red-300 border-red-500/30">
                          Conflicts
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>@{branch.author}</span>
                      <span>{branch.commits} commits</span>
                      <span>{branch.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                {branch.status === 'ready' && (
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-lg hover:bg-violet-500/30 transition-all">
                    <GitMerge className="h-3 w-3" />
                    Merge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Key Vault */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Secure API Vault</h3>
          <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-300 rounded-full">
            Encrypted
          </span>
        </div>

        <div className="space-y-3">
          {mockApiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="group relative rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] p-4 backdrop-blur-sm transition-all hover:border-amber-500/30 hover:bg-[rgba(245,158,11,0.05)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/30">
                    <Key className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {apiKey.name}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        apiKey.isActive 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }`}>
                        {apiKey.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{apiKey.service}</span>
                      <span>Last used: {apiKey.lastUsed}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="text-xs bg-slate-800/50 px-2 py-1 rounded text-slate-300 font-mono">
                        {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-1 rounded hover:bg-slate-700/50 transition-colors"
                      >
                        {showKeys[apiKey.id] ? (
                          <EyeOff className="h-3 w-3 text-slate-400" />
                        ) : (
                          <Eye className="h-3 w-3 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key), apiKey.id)}
                        className="p-1 rounded hover:bg-slate-700/50 transition-colors"
                      >
                        {copiedKey === apiKey.id ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Activity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Team Activity</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
            <div className="text-2xl font-bold text-cyan-300">4</div>
            <div className="text-xs text-slate-500">Active Members</div>
          </div>
          <div className="text-center p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-300">12</div>
            <div className="text-xs text-slate-500">Commits Today</div>
          </div>
          <div className="text-center p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
            <div className="text-2xl font-bold text-violet-300">2</div>
            <div className="text-xs text-slate-500">PRs Open</div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-white/[0.08] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm">
          <h4 className="text-sm font-semibold text-white mb-2">Recent Activity</h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>rohan merged feature/career-module into main</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>sarah pushed 3 commits to feature/curriculum-tree</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>alex opened PR #23 for zen timer improvements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
