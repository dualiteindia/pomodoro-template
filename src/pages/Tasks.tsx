import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Button } from '../components/ui/Button';
import { TreeVisual } from '../components/TreeVisual';
import { getTreeStage } from '../lib/utils';
import { Plus, Trash2, Check, PlayCircle, Timer, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Tasks: React.FC = () => {
  const { state, dispatch } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [estimatedSessions, setEstimatedSessions] = useState(4); // Default to 4 pomodoros
  const navigate = useNavigate();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    dispatch({ 
        type: 'ADD_TASK', 
        payload: { 
            title: newTaskTitle, 
            totalSessions: Math.max(1, estimatedSessions) 
        } 
    });
    setNewTaskTitle('');
    setEstimatedSessions(4);
  };

  const handleSelect = (id: string) => {
      dispatch({ type: 'SELECT_TASK', payload: id });
      navigate('/');
  }

  const activeTasks = state.tasks.filter(t => !t.isCompleted);
  const completedTasks = state.tasks.filter(t => t.isCompleted);

  return (
    <div className="space-y-6 px-4 pt-6">
      <header>
        <h1 className="text-2xl font-bold text-nature-800">Your Garden</h1>
        <p className="text-nature-500">Plant seeds by creating tasks.</p>
      </header>

      {/* Task Creation Form */}
      <form onSubmit={handleAddTask} className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-nature-100 shadow-sm">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What do you want to focus on?"
          className="w-full px-4 py-3 rounded-xl border border-nature-200 bg-nature-50/50 focus:outline-none focus:ring-2 focus:ring-nature-400 text-nature-800 placeholder:text-nature-300"
        />
        
        <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-xl border border-nature-200 bg-nature-50/50">
                <Timer size={18} className="text-nature-400" />
                <input
                    type="number"
                    min="1"
                    max="20"
                    value={estimatedSessions}
                    onChange={(e) => setEstimatedSessions(parseInt(e.target.value) || 1)}
                    className="w-full bg-transparent focus:outline-none text-nature-800 font-medium"
                    placeholder="Sessions"
                />
                <span className="text-xs text-nature-400 whitespace-nowrap">sessions</span>
            </div>
            <Button type="submit" className="px-6 rounded-xl whitespace-nowrap">
              <Plus size={18} /> Plant
            </Button>
        </div>
      </form>

      {/* Active Tasks List */}
      <div className="space-y-4 pb-24">
        <AnimatePresence mode="popLayout">
          {activeTasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-10 text-nature-400 flex flex-col items-center gap-2"
              >
                  <Sprout size={32} className="opacity-50" />
                  <p>No seeds planted yet.</p>
              </motion.div>
          )}
          
          {activeTasks.map((task) => {
            const stage = getTreeStage(task.sessionsCompleted, task.totalSessions);
            const progress = Math.round((task.sessionsCompleted / task.totalSessions) * 100);
            
            return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white p-4 rounded-2xl border transition-all ${state.activeTaskId === task.id ? 'border-nature-500 shadow-md ring-1 ring-nature-500 bg-nature-50/30' : 'border-nature-100 hover:border-nature-300'}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Mini 3D Preview */}
                    <div className="w-12 h-12 bg-nature-50 rounded-lg shrink-0 overflow-hidden border border-nature-100">
                        <TreeVisual stage={stage} size="sm" className="w-full h-full" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-nature-900 truncate">{task.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                          <div className="h-1.5 flex-1 bg-nature-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-nature-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                          </div>
                          <p className="text-xs text-nature-400 whitespace-nowrap font-medium">
                            {task.sessionsCompleted}/{task.totalSessions}
                          </p>
                      </div>
                    </div>
    
                    <div className="flex items-center gap-1 shrink-0">
                        {state.activeTaskId !== task.id && (
                            <button 
                                onClick={() => handleSelect(task.id)}
                                className="p-2 text-nature-400 hover:text-nature-600 hover:bg-nature-50 rounded-full transition-colors"
                                title="Focus on this task"
                            >
                                <PlayCircle size={22} />
                            </button>
                        )}
                        <button 
                            onClick={() => dispatch({ type: 'COMPLETE_TASK', payload: task.id })}
                            className="p-2 text-nature-400 hover:text-nature-600 hover:bg-nature-50 rounded-full transition-colors"
                            title="Harvest (Complete)"
                        >
                            <Check size={22} />
                        </button>
                    </div>
                  </div>
                </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Harvested / Completed Tasks Section */}
        {completedTasks.length > 0 && (
            <div className="pt-8 border-t border-nature-100">
                <h3 className="text-sm font-bold text-nature-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    Harvested <span className="bg-nature-100 text-nature-600 px-2 py-0.5 rounded-full text-[10px]">{completedTasks.length}</span>
                </h3>
                <div className="space-y-2">
                    {completedTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-nature-50/50 rounded-xl border border-transparent hover:border-nature-100 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="w-2 h-2 rounded-full bg-nature-300 shrink-0" />
                                <span className="text-nature-700 truncate text-sm">{task.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-nature-400">
                                    {getTreeStage(task.sessionsCompleted, task.totalSessions)}
                                </span>
                                <button 
                                    onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })} 
                                    className="text-nature-300 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
