import { useMemo } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import FocusChart from './FocusChart';

export default function TrackerDrawer() {
  const { totalFocusTime, focusLogs, closeModule, sessionStartTime } = useAtlasStore();

  // Format seconds to HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!sessionStartTime) {
      return {
        totalSessionTime: 0,
        distractedTime: 0,
        focusPercentage: 100,
      };
    }

    const now = new Date();
    const totalSessionTime = Math.floor((now - sessionStartTime) / 1000);
    const distractedTime = totalSessionTime - totalFocusTime;
    const focusPercentage = totalSessionTime > 0 ? (totalFocusTime / totalSessionTime) * 100 : 100;

    return {
      totalSessionTime,
      distractedTime,
      focusPercentage: Math.min(Math.max(focusPercentage, 0), 100),
    };
  }, [sessionStartTime, totalFocusTime]);

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-black/80 backdrop-blur-xl border-l border-cyan-500/20 shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-cyan-400 tracking-wider">CHRONOS</h2>
          <button
            onClick={closeModule}
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-2xl font-light"
          >
            ×
          </button>
        </div>
      </div>

      {/* Focus Chart */}
      <div className="p-6 border-b border-cyan-500/20">
        <FocusChart focusPercentage={metrics.focusPercentage} />
      </div>

      {/* Stats Grid */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-cyan-300 text-xs uppercase tracking-wider mb-1">Total Time</p>
            <p className="text-lg font-bold text-white tabular-nums">{formatTime(metrics.totalSessionTime)}</p>
          </div>
          <div className="text-center">
            <p className="text-green-300 text-xs uppercase tracking-wider mb-1">Focus Time</p>
            <p className="text-lg font-bold text-white tabular-nums">{formatTime(totalFocusTime)}</p>
          </div>
          <div className="text-center">
            <p className="text-red-300 text-xs uppercase tracking-wider mb-1">Distracted</p>
            <p className="text-lg font-bold text-white tabular-nums">{formatTime(metrics.distractedTime)}</p>
          </div>
        </div>
      </div>

      {/* Focus Logs */}
      <div className="p-6 overflow-y-auto h-[calc(100%-400px)]">
        <h3 className="text-cyan-400 text-sm uppercase tracking-widest mb-4">Focus Events</h3>
        
        {focusLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No focus events recorded yet</p>
        ) : (
          <div className="space-y-3">
            {focusLogs.map((log, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  log.type === 'out'
                    ? 'bg-red-900/20 border-red-500/30'
                    : 'bg-green-900/20 border-green-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      log.type === 'out' ? 'bg-red-400' : 'bg-green-400'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      log.type === 'out' ? 'text-red-300' : 'text-green-300'
                    }`}
                  >
                    {log.event}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">{log.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
