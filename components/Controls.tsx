import React from 'react';
import { Play, Monitor, RefreshCw, X } from 'lucide-react';

interface ControlsProps {
  isProjectorMode: boolean;
  toggleProjectorMode: () => void;
  startDemo: (seconds: number) => void;
  reset: () => void;
  isDemoActive: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isProjectorMode,
  toggleProjectorMode,
  startDemo,
  reset,
  isDemoActive
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Always hide controls unless hovered, regardless of mode
  const containerClass = "opacity-0 hover:opacity-100 transition-opacity duration-300";

  const btnBase = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all";
  const btnPrimary = isProjectorMode
    ? "bg-white text-black hover:bg-gray-200"
    : "bg-gray-900 text-white hover:bg-gray-800";
  const btnSecondary = isProjectorMode
    ? "border border-white/30 hover:bg-white/10"
    : "border border-gray-300 hover:bg-gray-50";

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${containerClass}`}>
         <button
          onClick={() => setIsOpen(true)}
          className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all ${
            isProjectorMode 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          <Monitor size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col gap-4 p-5 rounded-2xl shadow-xl backdrop-blur-md transition-all border w-[280px] ${
      isProjectorMode 
        ? 'bg-black/50 border-white/10 text-white' 
        : 'bg-white/90 border-gray-200 text-gray-800'
    }`}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider opacity-70">Settings</span>
        <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Toggle Mode */}
        <button
          onClick={toggleProjectorMode}
          className={`${btnBase} ${btnPrimary} w-full`}
        >
          <Monitor size={16} />
          {isProjectorMode ? 'Switch to Normal Mode' : 'Switch to Projector Mode'}
        </button>

        <div className="h-px bg-current opacity-10" />

        {/* Demo Controls */}
        {!isDemoActive ? (
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase opacity-50 block">Start Demo</span>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => startDemo(10)} className={`${btnBase} ${btnSecondary} !px-2`}>
                10s
              </button>
              <button onClick={() => startDemo(30)} className={`${btnBase} ${btnSecondary} !px-2`}>
                30s
              </button>
              <button onClick={() => startDemo(60)} className={`${btnBase} ${btnSecondary} !px-2`}>
                1m
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
                 <button onClick={() => startDemo(300)} className={`${btnBase} ${btnSecondary} !px-2`}>
                5m
              </button>
               <button onClick={() => startDemo(3600)} className={`${btnBase} ${btnSecondary} !px-2`}>
                1h
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={reset}
            className={`${btnBase} ${btnSecondary} w-full`}
          >
            <RefreshCw size={16} />
            Reset Demo
          </button>
        )}
      </div>

      <p className="text-[10px] opacity-50 text-center">
        Projector mode enhances contrast.
      </p>
    </div>
  );
};