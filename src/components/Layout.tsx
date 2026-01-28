import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ListTodo, Trees, BarChart2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navItems = [
    { icon: Home, label: 'Focus', path: '/' },
    { icon: ListTodo, label: 'Tasks', path: '/tasks' },
    { icon: Trees, label: 'Forest', path: '/forest' },
    { icon: BarChart2, label: 'Stats', path: '/stats' },
  ];

  return (
    // Dynamic background: Green for Home, White/Light for others
    <div className={cn(
        "min-h-screen font-sans transition-colors duration-500 selection:bg-nature-200",
        isHome ? "bg-nature-500" : "bg-nature-50"
    )}>
      <main className="pb-24 min-h-screen flex flex-col relative overflow-hidden">
        {children}
      </main>

      {/* Navigation Bar */}
      <nav className={cn(
          "fixed bottom-0 left-0 right-0 backdrop-blur-md border-t px-6 py-4 z-50 transition-colors duration-500",
          isHome ? "bg-nature-600/30 border-white/10" : "bg-white/80 border-nature-100"
      )}>
        <div className="max-w-md mx-auto flex justify-between items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  isActive 
                    ? (isHome ? "text-white" : "text-nature-600") 
                    : (isHome ? "text-white/40 hover:text-white/70" : "text-nature-300 hover:text-nature-400")
                )
              }
            >
              <item.icon size={24} strokeWidth={2.5} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
