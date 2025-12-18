import { useState, useEffect, useRef, useCallback } from "react";

interface UseReservationTimerProps {
  duration: number; // Duration in milliseconds
  onExpire: () => void;
  enabled?: boolean;
  startTime?: number | null; // Optional start timestamp for persistence across refreshes
}

interface UseReservationTimerReturn {
  timeRemaining: number;
  isExpired: boolean;
  minutes: number;
  seconds: number;
  isWarning: boolean;
  percentRemaining: number;
  isLoading: boolean;
}

const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export function useReservationTimer({
  duration,
  onExpire,
  enabled = true,
  startTime = null,
}: UseReservationTimerProps): UseReservationTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const startTimeRef = useRef<number | null>(startTime);
  const hasExpiredRef = useRef(false);

  // Store onExpire in a ref to avoid it triggering effect re-runs
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Stable callback that reads from the ref
  const handleExpire = useCallback(() => {
    onExpireRef.current();
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    // Use provided startTime or set new one
    if (!startTimeRef.current) startTimeRef.current = startTime || Date.now();

    // Calculate initial remaining time immediately
    const elapsed = Date.now() - (startTimeRef.current || Date.now());
    const initialRemaining = duration - elapsed;

    if (initialRemaining <= 0) {
      // Already expired
      if (!hasExpiredRef.current) {
        hasExpiredRef.current = true;
        setIsExpired(true);
        setTimeRemaining(0);
        handleExpire();
      }
      setIsLoading(false);
      return;
    }

    setTimeRemaining(initialRemaining);
    setIsLoading(false);

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        // Reservation expired
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          setIsExpired(true);
          setTimeRemaining(0);
          handleExpire();
        }
        clearInterval(intervalId);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [duration, handleExpire, enabled, startTime]);

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const isWarning = timeRemaining < WARNING_THRESHOLD && timeRemaining > 0;
  const percentRemaining = (timeRemaining / duration) * 100;

  return {
    timeRemaining,
    isExpired,
    minutes,
    seconds,
    isWarning,
    percentRemaining,
    isLoading,
  };
}

