import { useState } from "react";

export function useSuggest() {
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [suggestionTarget, setSuggestionTarget] = useState(null);

  function openSuggestion(target) {
    setSuggestionTarget(target);
    setShowSuggestionDialog(true);
  }

  function closeSuggestion() {
    setSuggestionTarget(null);
    setShowSuggestionDialog(false);
  }

  return {
    showSuggestionDialog,
    suggestionTarget,
    openSuggestion,
    closeSuggestion,
  };
}
