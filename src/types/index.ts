export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
export type TimerState = 'IDLE' | 'RUNNING' | 'PAUSED';

export interface Task {
  id: string;
  title: string;
  totalSessions: number; // Target number of sessions
  sessionsCompleted: number;
  isCompleted: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface AppState {
  tasks: Task[];
  activeTaskId: string | null;
  timerMode: TimerMode;
  timerState: TimerState;
  timeLeft: number; // in seconds
  sessionsSinceLongBreak: number;
  dailyStats: {
    [date: string]: {
      focusTime: number; // seconds
      sessionsCompleted: number;
      // We can still keep a generic score if needed, or just track raw stats
      growthPoints: number; 
    }
  };
}

export type TreeStage = "SEED" | "SPROUT" | "SAPLING" | "YOUNG" | "MATURE";
