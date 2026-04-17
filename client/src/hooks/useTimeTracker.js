import { useEffect } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';

export const useTimeTracker = () => {
  const {
    incrementFocusTime,
    addFocusLog,
    setIsActive,
    isActive,
    setSessionStartTime,
    sessionStartTime,
  } = useAtlasStore();

  useEffect(() => {
    // Set session start time on mount
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab lost focus
        setIsActive(false);
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        addFocusLog({ event: 'Focus Lost', timestamp, type: 'out' });
      } else {
        // Tab regained focus
        setIsActive(true);
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        addFocusLog({ event: 'Focus Regained', timestamp, type: 'in' });
      }
    };

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up timer to increment focus time
    const interval = setInterval(() => {
      if (isActive && !document.hidden) {
        incrementFocusTime();
      }
    }, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [incrementFocusTime, addFocusLog, setIsActive, isActive, setSessionStartTime, sessionStartTime]);
};
