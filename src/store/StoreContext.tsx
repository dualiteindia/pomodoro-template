import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppState, Task, TimerMode, TimerState } from '../types';
import { generateId } from '../lib/utils';

// Constants
export const FOCUS_TIME = 25 * 60;
export const SHORT_BREAK_TIME = 5 * 60;
export const LONG_BREAK_TIME = 20 * 60;
// We can keep points for the "Stats" view score, even if tree doesn't use it directly
export const POINTS_PER_SESSION = 10; 

// Initial State
const initialState: AppState = {
  tasks: [],
  activeTaskId: null,
  timerMode: 'FOCUS',
  timerState: 'IDLE',
  timeLeft: FOCUS_TIME,
  sessionsSinceLongBreak: 0,
  dailyStats: {},
};

// Actions
type Action =
  | { type: 'ADD_TASK'; payload: { title: string; totalSessions: number } }
  | { type: 'SELECT_TASK'; payload: string }
  | { type: 'UPDATE_TIMER_STATE'; payload: TimerState }
  | { type: 'TICK'; payload: number }
  | { type: 'SET_MODE'; payload: TimerMode }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState };

// Reducer
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      const newTask: Task = {
        id: generateId(),
        title: action.payload.title,
        totalSessions: action.payload.totalSessions,
        sessionsCompleted: 0,
        isCompleted: false,
        createdAt: Date.now(),
      };
      return { ...state, tasks: [newTask, ...state.tasks], activeTaskId: state.activeTaskId || newTask.id };

    case 'SELECT_TASK':
      return { ...state, activeTaskId: action.payload };

    case 'UPDATE_TIMER_STATE':
      return { ...state, timerState: action.payload };

    case 'TICK':
      return { ...state, timeLeft: action.payload };

    case 'SET_MODE':
      let newTime = FOCUS_TIME;
      if (action.payload === 'SHORT_BREAK') newTime = SHORT_BREAK_TIME;
      if (action.payload === 'LONG_BREAK') newTime = LONG_BREAK_TIME;
      return { ...state, timerMode: action.payload, timeLeft: newTime, timerState: 'IDLE' };

    case 'COMPLETE_SESSION': {
      const isFocus = state.timerMode === 'FOCUS';
      const today = new Date().toISOString().split('T')[0];
      
      // Update Stats
      const currentStats = state.dailyStats[today] || { focusTime: 0, sessionsCompleted: 0, growthPoints: 0 };
      const updatedStats = isFocus ? {
        ...currentStats,
        sessionsCompleted: currentStats.sessionsCompleted + 1,
        growthPoints: currentStats.growthPoints + POINTS_PER_SESSION,
        focusTime: currentStats.focusTime + FOCUS_TIME
      } : currentStats;

      // Update Task Progress
      let updatedTasks = state.tasks;
      if (isFocus && state.activeTaskId) {
        updatedTasks = state.tasks.map(t => 
          t.id === state.activeTaskId 
            ? { ...t, sessionsCompleted: t.sessionsCompleted + 1 }
            : t
        );
      }

      // Determine Next Mode
      let nextMode: TimerMode = 'FOCUS';
      let sessionsCount = state.sessionsSinceLongBreak;
      
      if (isFocus) {
        sessionsCount += 1;
        if (sessionsCount >= 4) {
          nextMode = 'LONG_BREAK';
          sessionsCount = 0;
        } else {
          nextMode = 'SHORT_BREAK';
        }
      } else {
        nextMode = 'FOCUS';
      }

      const nextTime = nextMode === 'FOCUS' ? FOCUS_TIME : (nextMode === 'LONG_BREAK' ? LONG_BREAK_TIME : SHORT_BREAK_TIME);

      return {
        ...state,
        tasks: updatedTasks,
        dailyStats: { ...state.dailyStats, [today]: updatedStats },
        timerMode: nextMode,
        timeLeft: nextTime,
        timerState: 'IDLE',
        sessionsSinceLongBreak: sessionsCount
      };
    }

    case 'COMPLETE_TASK':
        return {
            ...state,
            tasks: state.tasks.map(t => t.id === action.payload ? { ...t, isCompleted: true, completedAt: Date.now() } : t),
            activeTaskId: state.activeTaskId === action.payload ? null : state.activeTaskId
        };

    case 'DELETE_TASK':
        return {
            ...state,
            tasks: state.tasks.filter(t => t.id !== action.payload),
            activeTaskId: state.activeTaskId === action.payload ? null : state.activeTaskId
        };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

// Context
const StoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('focus-forest-state');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Migration: Ensure old tasks have totalSessions if missing
        if (parsedState.tasks) {
            parsedState.tasks = parsedState.tasks.map((t: any) => ({
                ...t,
                totalSessions: t.totalSessions || 4, // Default to 4 if missing
                sessionsCompleted: t.sessionsCompleted || 0
            }));
        }
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('focus-forest-state', JSON.stringify(state));
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
