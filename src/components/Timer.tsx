import React from 'react';
import { useStore } from '../store/StoreContext';
import { motion } from 'framer-motion';
import { cn, getTreeStage } from '../lib/utils';
import { FOCUS_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME } from '../store/StoreContext';
import { TreeVisual } from './TreeVisual';

export const Timer: React.FC = () => {
  const { state } = useStore();
  
  const totalTime = state.timerMode === 'FOCUS' ? FOCUS_TIME : (state.timerMode === 'SHORT_BREAK' ? SHORT_BREAK_TIME : LONG_BREAK_TIME);
  const progress = ((totalTime - state.timeLeft) / totalTime) * 100;
  
  const activeTask = state.tasks.find(t => t.id === state.activeTaskId);
  
  // Calculate stage based on sessions completed vs total sessions
  const treeStage = activeTask 
    ? getTreeStage(activeTask.sessionsCompleted, activeTask.totalSessions) 
    : 'SEED';

  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      
      {/* Central "Hole" / World for the Tree */}
      <div className="absolute inset-4 rounded-full bg-[#eaddc8] overflow-hidden shadow-inner border-4 border-[#dce6d5]">
         {/* Tree sits inside this world */}
         <div className="absolute inset-0 top-8"> 
            <TreeVisual stage={treeStage} size="lg" className="w-full h-full" />
         </div>
      </div>

      {/* Timer SVG Overlay */}
      <svg className="absolute w-full h-full transform -rotate-90 pointer-events-none z-10">
        {/* Track */}
        <circle
          cx="144"
          cy="144"
          r="136"
          className="stroke-white/20 fill-none"
          strokeWidth="6"
        />
        {/* Progress */}
        <motion.circle
          cx="144"
          cy="144"
          r="136"
          className={cn(
            "fill-none stroke-current transition-colors duration-500 shadow-lg drop-shadow-md",
            state.timerMode === 'FOCUS' ? "text-[#eaddc8]" : "text-white"
          )}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="854.5" // 2 * pi * 136
          animate={{
            strokeDashoffset: 854.5 - (854.5 * progress) / 100
          }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
    </div>
  );
};
