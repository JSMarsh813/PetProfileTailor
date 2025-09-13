import { useState } from "react";

export function useToggleState({
  initialActive,
  apiUrl,
  body,
  onApplyOptimistic, // custom function for optimistic updates
  onRollback, // custom function for rollback
}) {
  const [active, setActive] = useState(initialActive);
  // ex was it initially like or not; true or false
  const [isProcessing, setIsProcessing] = useState(false);

  const toggle = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const prevActive = active;

    setActive(!prevActive);

    // let parent hook manage how to optimistically update external refs/state
    onApplyOptimistic?.(!prevActive);

    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("toggle error", err);
      setActive(prevActive);
      onRollback?.(prevActive);
    } finally {
      setIsProcessing(false);
    }
  };

  return { active, isProcessing, toggle };
}
