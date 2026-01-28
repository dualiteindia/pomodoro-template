import { useEffect, useRef } from 'react';
import { useStore } from '../store/StoreContext';

export function useTimer() {
  const { state, dispatch } = useStore();
  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.timerState === 'RUNNING') {
      // If we just started (or resumed), calculate the target end time
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + state.timeLeft * 1000;
      }

      const tick = () => {
        if (!endTimeRef.current) return;
        
        const now = Date.now();
        const remaining = Math.ceil((endTimeRef.current - now) / 1000);

        if (remaining <= 0) {
          dispatch({ type: 'COMPLETE_SESSION' });
          endTimeRef.current = null;
        } else {
            // Only dispatch if the second actually changed to avoid excessive re-renders
            if (remaining !== state.timeLeft) {
                dispatch({ type: 'TICK', payload: remaining });
            }
            rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    } else {
      // If paused or idle, clear the ref
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      endTimeRef.current = null;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state.timerState, dispatch]); // Removed state.timeLeft dependency to avoid loop

  // Handle manual pause/resume logic updates for endTimeRef
  useEffect(() => {
      if (state.timerState === 'PAUSED' || state.timerState === 'IDLE') {
          endTimeRef.current = null;
      }
  }, [state.timerState]);

  const toggleTimer = () => {
    if (state.timerState === 'RUNNING') {
      dispatch({ type: 'UPDATE_TIMER_STATE', payload: 'PAUSED' });
    } else {
      dispatch({ type: 'UPDATE_TIMER_STATE', payload: 'RUNNING' });
    }
  };

  const resetTimer = () => {
      // Resetting essentially means setting mode again which resets time
      dispatch({ type: 'SET_MODE', payload: state.timerMode });
  }

  const completeEarly = () => {
      dispatch({ type: 'COMPLETE_SESSION' });
  }

  return { toggleTimer, resetTimer, completeEarly };
}
