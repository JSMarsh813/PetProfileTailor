import { useState } from "react";

export function useFlagging() {
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagTarget, setFlagTarget] = useState(null);

  function openFlag(target) {
    setFlagTarget(target);
    setShowFlagDialog(true);
  }

  function closeFlag() {
    setFlagTarget(null);
    setShowFlagDialog(false);
  }

  return {
    showFlagDialog,
    flagTarget,
    openFlag,
    closeFlag,
  };
}
