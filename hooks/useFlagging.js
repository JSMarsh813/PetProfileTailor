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

  //   reportsSetRef
  return {
    showFlagDialog,
    flagTarget,
    openFlag,
    closeFlag,
  };
}
