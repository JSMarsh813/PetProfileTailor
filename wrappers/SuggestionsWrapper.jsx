"use client";

import { SuggestionsProvider } from "@/context/SuggestionsContext";

export default function SuggestionsWrapper({ children, initialSuggestions }) {
  return (
    <SuggestionsProvider initialSuggestions={initialSuggestions}>
      {children}
    </SuggestionsProvider>
  );
}
