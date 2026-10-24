import { useEffect, useState } from "react";

export function useBookingHold(holdUntil: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!holdUntil) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [holdUntil]);

  const remainingSeconds = holdUntil
    ? Math.max(0, Math.ceil((Date.parse(holdUntil) - now) / 1000))
    : 0;

  return {
    remainingSeconds,
    expired: Boolean(holdUntil) && remainingSeconds === 0,
  };
}
