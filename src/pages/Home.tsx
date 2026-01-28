import React from 'react';
import { useStore } from '../store/StoreContext';
import { useTimer } from '../hooks/useTimer';
import { Timer } from '../components/Timer';
import { Button } from '../components/ui/Button';
import { Play, Pause, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const { state } = useStore();
  const { toggleTimer, completeEarly } = useTimer();

  const activeTask = state.tasks.find(t => t.id === state.activeTaskId);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 w-full max-w-md mx-auto">
      
      {/* Top Bar / Header Area */}
      <div className="w-full flex justify-between items-start px-4 pt-4">
         <div className="text-white/80">
            {/* Placeholder for menu icon if needed */}
         </div>
         
         {/* Active Task Pill */}
         {activeTask ? (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-center"
            >
                <p className="text-xs font-medium opacity-80 uppercase tracking-widest">Planting for</p>
                <p className="font-semibold truncate max-w-[150px]">{activeTask.title}</p>
            </motion.div>
         ) : (
             <Link to="/tasks">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white animate-pulse">
                    Select a Task
                </div>
             </Link>
         )}
         
         <div className="text-white/80">
            {/* Placeholder for coins/stats */}
         </div>
      </div>

      {/* Main Visual Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        
        {/* Motivational Text */}
        <div className="h-12 mb-4 flex items-center justify-center">
            <p className="text-white/90 font-medium text-lg text-center">
                {state.timerState === 'RUNNING' ? "Stop phubbing!" : "Start planting today!"}
            </p>
        </div>

        {/* The 3D Timer World */}
        <Timer />

        {/* Big Time Display (Below the circle as per design) */}
        <div className="mt-8 mb-8">
            <h1 className="text-7xl font-light text-white font-display tracking-tight">
                {formatTime(state.timeLeft)}
            </h1>
        </div>

        {/* Controls */}
        <div className="w-full px-8">
            {state.timerState === 'IDLE' && state.timeLeft === (state.timerMode === 'FOCUS' ? 25*60 : 5*60) ? (
                 <Button 
                    onClick={toggleTimer} 
                    className="w-full h-14 text-lg bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-sm rounded-full shadow-lg"
                    disabled={!activeTask && state.timerMode === 'FOCUS'}
                >
                    Plant
                </Button>
            ) : (
                <div className="flex flex-col gap-3 w-full">
                    <Button 
                        onClick={toggleTimer} 
                        className="w-full h-14 text-lg bg-transparent border-2 border-white/50 text-white hover:bg-white/10 rounded-full"
                    >
                        {state.timerState === 'RUNNING' ? 'Pause' : 'Resume'}
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        onClick={completeEarly} 
                        className="text-white/60 hover:text-white hover:bg-transparent text-sm"
                    >
                        Give Up (Finish Early)
                    </Button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
