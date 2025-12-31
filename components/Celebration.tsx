import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationProps {
  isProjectorMode: boolean;
}

export const Celebration: React.FC<CelebrationProps> = ({ isProjectorMode }) => {
  useEffect(() => {
    // Initial explosion
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
    
    // Big central blast at start
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: isProjectorMode ? ['#ffffff', '#FFD700', '#FF00FF'] : undefined
    });

    return () => clearInterval(interval);
  }, [isProjectorMode]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 fade-in w-full overflow-hidden">
      <h1 className={`text-5xl md:text-[10vw] font-black text-center leading-[0.8] tracking-tighter uppercase ${
        isProjectorMode ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'text-gray-900'
      }`}>
        HAPPY<br/>NEW YEAR
      </h1>
    </div>
  );
};