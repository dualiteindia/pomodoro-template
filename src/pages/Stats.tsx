import React from 'react';
import { useStore } from '../store/StoreContext';
import { BarChart, Clock, Trophy } from 'lucide-react';

export const Stats: React.FC = () => {
  const { state } = useStore();
  
  // Calculate aggregate stats
  const totalSessions = Object.values(state.dailyStats).reduce((acc, curr) => acc + curr.sessionsCompleted, 0);
  const totalFocusMinutes = Math.round(Object.values(state.dailyStats).reduce((acc, curr) => acc + curr.focusTime, 0) / 60);
  const totalTreesGrown = state.tasks.filter(t => t.isCompleted).length;

  const StatCard = ({ icon: Icon, label, value, sub }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-nature-100 shadow-sm flex items-center gap-4">
        <div className="bg-nature-50 p-3 rounded-xl text-nature-600">
            <Icon size={24} />
        </div>
        <div>
            <p className="text-nature-400 text-xs uppercase font-bold tracking-wider">{label}</p>
            <p className="text-2xl font-semibold text-nature-800">{value}</p>
            {sub && <p className="text-xs text-nature-400">{sub}</p>}
        </div>
    </div>
  );

  return (
    <div className="space-y-6 px-4 pt-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-nature-800">Insights</h1>
        <p className="text-nature-500">Track your growth over time.</p>
      </header>

      <div className="grid gap-4">
        <StatCard 
            icon={Clock} 
            label="Total Focus" 
            value={`${Math.floor(totalFocusMinutes / 60)}h ${totalFocusMinutes % 60}m`} 
            sub="Time spent in deep work"
        />
        <StatCard 
            icon={BarChart} 
            label="Sessions" 
            value={totalSessions} 
            sub="Pomodoros completed"
        />
        <StatCard 
            icon={Trophy} 
            label="Trees Harvested" 
            value={totalTreesGrown} 
            sub="Tasks completed"
        />
      </div>

      {/* Simple Visualization of Daily Activity */}
      <div className="bg-white p-6 rounded-2xl border border-nature-100 shadow-sm">
        <h3 className="text-nature-800 font-semibold mb-4">Recent Activity</h3>
        <div className="flex items-end justify-between h-32 gap-2">
            {[...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const dateStr = d.toISOString().split('T')[0];
                const stat = state.dailyStats[dateStr];
                const height = stat ? Math.min((stat.focusTime / 3600) * 100, 100) : 0; // Cap at 100% for 1 hour roughly for visual
                
                return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full bg-nature-50 rounded-t-lg relative h-full flex items-end overflow-hidden">
                            <div 
                                className="w-full bg-nature-400 rounded-t-lg transition-all duration-500"
                                style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                            />
                        </div>
                        <span className="text-[10px] text-nature-400">
                            {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
                        </span>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};
