export default function startCooldown(
  intervalRef,
  setRemainingCooldown,
  seconds = 5,
) {
  if (intervalRef.current) return; // interval already running
  setRemainingCooldown(seconds);

  intervalRef.current = setInterval(() => {
    setRemainingCooldown((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
}
