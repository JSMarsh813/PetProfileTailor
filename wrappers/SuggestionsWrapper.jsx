"use client";
import { useEffect, useState } from "react";

import { SuggestionsProvider } from "@/context/SuggestionsContext";

export default function SuggestionsWrapper({ children }) {
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    fetch("/api/user/suggestions", { cache: "no-store" })
      .then((res) => res.json())
      .then(setSuggestions)
      .catch(console.error);
  }, []);

  return (
    <SuggestionsProvider initialSuggestions={suggestions}>
      {children}
    </SuggestionsProvider>
  );
}
