"use client";

import { SuggestionsProvider } from "@/context/SuggestionsContext";

export default function SuggestionsWrapper({ children }) {
  // useEffect(() => {
  //   fetch("/api/user/suggestions", { cache: "no-store" })
  //     .then((res) => res.json())
  //     .then(setSuggestions)
  //     .catch(console.error);
  // }, []);

  return <SuggestionsProvider>{children}</SuggestionsProvider>;
}
