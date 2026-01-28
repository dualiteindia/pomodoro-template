import React from 'react';
import { useStore } from '../store/StoreContext';
import { TreeVisual } from '../components/TreeVisual';
import { getTreeStage } from '../lib/utils';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

export const Forest: React.FC = () => {
  const { state } = useStore();
  // Forest is made by completed tasks
  const completedTasks = state.tasks.filter(t => t.isCompleted);

  return (
    <div className="min-h-screen bg-nature-50/50 pb-24">
      {/* Header */}
      <div className="bg-nature-600 text-white px-6 pt-8 pb-12 rounded-b-[2.5rem] shadow-sm relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold font-display">Your Forest</h1>
            <p className="text-nature-100 opacity-90 mt-1">
                You have grown <span className="font-bold text-white">{completedTasks.length}</span> trees.
            </p>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      </div>

      <div className="px-4 -mt-6">
        {completedTasks.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-nature-100 flex flex-col items-center text-center space-y-4"
            >
                <div className="w-20 h-20 bg-nature-50 rounded-full flex items-center justify-center text-nature-300">
                    <Sprout size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-nature-800">No trees yet</h3>
                    <p className="text-nature-400 text-sm mt-1 max-w-[200px] mx-auto">
                        Complete tasks in your garden to harvest them here.
                    </p>
                </div>
            </motion.div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {completedTasks.map((task, i) => {
                    // Calculate the final stage the tree reached
                    const finalStage = getTreeStage(task.sessionsCompleted, task.totalSessions);
                    
                    return (
                        <motion.div 
                            key={task.id}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                            className="group relative"
                        >
                            {/* Tree Card */}
                            <div className="bg-white rounded-2xl p-2 shadow-sm border border-nature-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                {/* 3D Viewport */}
                                <div className="aspect-[4/5] bg-gradient-to-b from-nature-50 to-[#eaddc8]/30 rounded-xl relative">
                                    <TreeVisual 
                                        stage={finalStage} 
                                        size="full" 
                                        className="w-full h-full" 
                                    />
                                    
                                    {/* Stage Badge */}
                                    <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-nature-600 border border-nature-100 shadow-sm">
                                        {finalStage}
                                    </div>
                                </div>

                                {/* Task Details */}
                                <div className="mt-3 px-1 pb-1">
                                    <h4 className="font-medium text-nature-800 text-sm truncate" title={task.title}>
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] text-nature-400 font-medium bg-nature-50 px-1.5 py-0.5 rounded-md">
                                            {task.sessionsCompleted}/{task.totalSessions} Sessions
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};
