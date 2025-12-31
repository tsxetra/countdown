import React, { useState, useEffect, useRef } from 'react';
import { calculateTimeLeft, getNextNewYear } from './utils/timeUtils';
import { TimeLeft, AppPhase } from './types';
import { TimerDisplay } from './components/TimerDisplay';
import { Controls } from './components/Controls';
import { Celebration } from './components/Celebration';

const App: React.FC = () => {
  // State
  const [targetDate, setTargetDate] = useState<number>(getNextNewYear());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(getNextNewYear()));
  const [phase, setPhase] = useState<AppPhase>(AppPhase.COUNTDOWN);
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);

  // Refs for animation timers to clear them on unmount/reset
  const zeroHoldTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Main Ticker Effect
  useEffect(() => {
    const timer = setInterval(() => {
      // Don't update time if we are already in celebration or transition phases
      // This prevents the number from jumping to negative or resetting weirdly
      if (phase === AppPhase.ZERO_HOLD || phase === AppPhase.ZOOM_TRANSITION || phase === AppPhase.CELEBRATION) {
        return;
      }

      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      // State Transition Logic
      if (newTimeLeft.totalSeconds <= 0) {
        // We hit Zero
        if (phase !== AppPhase.ZERO_HOLD) {
          triggerZeroSequence();
        }
      } else if (newTimeLeft.totalSeconds <= 60 && phase !== AppPhase.FINAL_MINUTE) {
        setPhase(AppPhase.FINAL_MINUTE);
      } else if (newTimeLeft.totalSeconds > 60 && phase !== AppPhase.COUNTDOWN) {
        setPhase(AppPhase.COUNTDOWN);
      }

    }, 100); // 100ms for responsiveness

    return () => clearInterval(timer);
  }, [targetDate, phase]);

  const triggerZeroSequence = () => {
    setPhase(AppPhase.ZERO_HOLD);
    
    // 1. Hold Zero for 2 seconds
    zeroHoldTimeout.current = setTimeout(() => {
      setPhase(AppPhase.ZOOM_TRANSITION);
      
      // 2. Zoom animation lasts about 1.5s (match CSS)
      zoomTimeout.current = setTimeout(() => {
        setPhase(AppPhase.CELEBRATION);
      }, 1400); // Slightly less than CSS animation to ensure smooth handover
      
    }, 2000);
  };

  const startDemo = (seconds: number = 10) => {
    // Reset any existing timeouts
    if (zeroHoldTimeout.current) clearTimeout(zeroHoldTimeout.current);
    if (zoomTimeout.current) clearTimeout(zoomTimeout.current);

    const now = Date.now();
    // Set target to [seconds] from now + 1 second buffer to see the start number
    setTargetDate(now + (seconds * 1000) + 1000); 
    setIsDemoActive(true);
    
    // Determine appropriate starting phase
    if (seconds <= 60) {
        setPhase(AppPhase.FINAL_MINUTE);
    } else {
        setPhase(AppPhase.COUNTDOWN);
    }
  };

  const reset = () => {
     if (zeroHoldTimeout.current) clearTimeout(zeroHoldTimeout.current);
    if (zoomTimeout.current) clearTimeout(zoomTimeout.current);
    
    setTargetDate(getNextNewYear());
    setIsDemoActive(false);
    setPhase(AppPhase.COUNTDOWN);
    setTimeLeft(calculateTimeLeft(getNextNewYear()));
  };

  // Background Styles
  const bgClass = isProjectorMode 
    ? 'bg-black' 
    : 'bg-gradient-to-br from-slate-50 to-slate-200';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden relative ${bgClass}`}>
      
      {/* Main Content */}
      <div className="z-10 w-full">
        {phase === AppPhase.CELEBRATION ? (
          <Celebration isProjectorMode={isProjectorMode} />
        ) : (
          <TimerDisplay 
            timeLeft={timeLeft} 
            phase={phase} 
            isProjectorMode={isProjectorMode} 
          />
        )}
      </div>

      {/* Controls */}
      <Controls 
        isProjectorMode={isProjectorMode}
        toggleProjectorMode={() => setIsProjectorMode(!isProjectorMode)}
        startDemo={startDemo}
        reset={reset}
        isDemoActive={isDemoActive}
      />

    </div>
  );
};

export default App;