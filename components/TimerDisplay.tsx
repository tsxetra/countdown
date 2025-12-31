import React from 'react';
import { TimeLeft, AppPhase } from '../types';
import { formatNumber } from '../utils/timeUtils';

interface TimerDisplayProps {
  timeLeft: TimeLeft;
  phase: AppPhase;
  isProjectorMode: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, phase, isProjectorMode }) => {
  
  // Base text styles
  const textBase = isProjectorMode ? 'text-white' : 'text-gray-900';
  const labelBase = isProjectorMode ? 'text-gray-400' : 'text-gray-400';
  
  // High contrast glow for projector
  const glow = isProjectorMode ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : '';

  // Specific rendering for final countdown (just seconds)
  if (phase === AppPhase.FINAL_MINUTE) {
    // Check if we are in the last 10 seconds (and strictly positive)
    const isLastTen = timeLeft.totalSeconds <= 10 && timeLeft.totalSeconds > 0;

    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span 
          key={timeLeft.seconds} // Key is essential to re-trigger animation on change
          className={`text-[25vw] font-black tabular-nums leading-none tracking-tighter ${textBase} ${glow} ${isLastTen ? 'animate-pop-in' : ''}`}
        >
          {timeLeft.seconds}
        </span>
      </div>
    );
  }

  // Specific rendering for Zero Hold and Zoom
  if (phase === AppPhase.ZERO_HOLD || phase === AppPhase.ZOOM_TRANSITION) {
     return (
      <div className={`flex items-center justify-center h-screen w-screen overflow-hidden`}>
        <span 
          className={`text-[25vw] font-black leading-none tracking-tighter ${textBase} ${glow} ${phase === AppPhase.ZOOM_TRANSITION ? 'zoom-through' : ''}`}
        >
          0
        </span>
      </div>
    );
  }

  // Determine if we should show the hours column
  // Show if we have days left, or if we have hours left (last 24h but not last 1h)
  const showHours = timeLeft.days > 0 || timeLeft.hours > 0;

  // Standard Display
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-wrap justify-center gap-12 md:gap-32 px-4 w-full">
        {/* Days */}
        {timeLeft.days > 0 && (
           <div className="flex flex-col items-center">
            <span className={`text-6xl md:text-9xl font-bold tabular-nums tracking-tight ${textBase} ${glow}`}>
              {formatNumber(timeLeft.days)}
            </span>
            <span className={`text-sm md:text-xl uppercase tracking-widest font-medium ${labelBase}`}>Days</span>
          </div>
        )}
       
        {/* Hours */}
        {showHours && (
          <div className="flex flex-col items-center">
            <span className={`text-6xl md:text-9xl font-bold tabular-nums tracking-tight ${textBase} ${glow}`}>
              {formatNumber(timeLeft.hours)}
            </span>
            <span className={`text-sm md:text-xl uppercase tracking-widest font-medium ${labelBase}`}>Hours</span>
          </div>
        )}

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <span className={`text-6xl md:text-9xl font-bold tabular-nums tracking-tight ${textBase} ${glow}`}>
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className={`text-sm md:text-xl uppercase tracking-widest font-medium ${labelBase}`}>Minutes</span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <span className={`text-6xl md:text-9xl font-bold tabular-nums tracking-tight ${textBase} ${glow}`}>
            {formatNumber(timeLeft.seconds)}
          </span>
          <span className={`text-sm md:text-xl uppercase tracking-widest font-medium ${labelBase}`}>Seconds</span>
        </div>
      </div>
    </div>
  );
};