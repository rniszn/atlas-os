import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Brain } from 'lucide-react';

export default function ZenPanel() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (!isBreak) {
      // Work session completed, start break
      setSessions(sessions + 1);
      setIsBreak(true);
      setMinutes(5); // 5-minute break
      setSeconds(0);
      
      // Play notification sound or show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: 'Time for a 5-minute break!',
          icon: '/favicon.ico'
        });
      }
    } else {
      // Break completed, start new work session
      setIsBreak(false);
      setMinutes(25);
      setSeconds(0);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Over!', {
          body: 'Ready for another focused session?',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
    : ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-1">Zen Forge</h2>
        <p className="text-sm text-slate-400">25-minute focused work sessions</p>
      </div>

      <div className="relative">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-48 h-48 rounded-full border-4 border-slate-700/50 relative">
              <div 
                className="absolute inset-0 rounded-full border-4 transition-all duration-1000"
                style={{
                  borderColor: isBreak ? '#10b981' : '#8b5cf6',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  transform: `rotate(${progress * 3.6}deg)`
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Brain className={`h-8 w-8 mb-2 ${isBreak ? 'text-green-400' : 'text-violet-400'}`} />
                <div className="text-3xl font-bold text-white font-mono">
                  {formatTime(minutes, seconds)}
                </div>
                <div className={`text-xs mt-1 ${isBreak ? 'text-green-400' : 'text-violet-400'}`}>
                  {isBreak ? 'Break Time' : 'Focus Time'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isActive
                ? 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
                : 'bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/30'
            } border`}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {minutes === 25 && seconds === 0 ? 'Start' : 'Resume'}
              </>
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-600/50 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
          <div className="text-2xl font-bold text-violet-300">{sessions}</div>
          <div className="text-xs text-slate-500">Sessions Today</div>
        </div>
        <div className="text-center p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-300">{sessions * 25}</div>
          <div className="text-xs text-slate-500">Minutes Focused</div>
        </div>
        <div className="text-center p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-300">{Math.floor(sessions * 25 / 60)}</div>
          <div className="text-xs text-slate-500">Hours Total</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-white/[0.08] bg-gradient-to-br from-violet-500/10 to-purple-600/10 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-400" />
            Pomodoro Technique
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <p>• Work for 25 minutes with complete focus</p>
            <p>• Take a 5-minute short break</p>
            <p>• After 4 sessions, take a 15-30 minute break</p>
            <p>• Eliminate distractions during work sessions</p>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-white/[0.08] bg-[rgba(15,23,42,0.4)] backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white mb-2">Focus Tips</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <p>• Turn off notifications on your devices</p>
            <p>• Close unnecessary tabs and applications</p>
            <p>• Keep a water bottle nearby</p>
            <p>• Use the break time to stretch and rest your eyes</p>
          </div>
        </div>
      </div>

      {sessions > 0 && (
        <div className="text-center p-4 rounded-lg border border-green-500/30 bg-green-500/10 backdrop-blur-sm">
          <p className="text-sm text-green-300">
            Great job! You've completed {sessions} focused session{sessions !== 1 ? 's' : ''} today.
          </p>
        </div>
      )}
    </div>
  );
}
