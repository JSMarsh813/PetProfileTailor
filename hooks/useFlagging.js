import { useState } from "react";

export function useFlagging(reportsSetRef) {
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

  // update set with the new report reportsSetRef
  // also add to state
  return {
    showFlagDialog,
    flagTarget,
    openFlag,
    closeFlag,
  };
}
