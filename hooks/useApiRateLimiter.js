import { useState, useEffect, useRef } from "react";

export function useApiRateLimiter({ limit = 5, windowMs = 2 * 60 * 1000 }) {
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // reset counter every window
    timerRef.current = setInterval(() => setCount(0), windowMs);
    return () => clearInterval(timerRef.current);
  }, [windowMs]);

  const canSend = () => count < limit;

  const registerSend = () => setCount((c) => c + 1);

  return { canSend, registerSend, count, limit };
}
