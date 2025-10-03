"use client";

import { createContext, useContext, useRef } from "react";

const SuggestionsContext = createContext(null);

export function useSuggestions() {
  const context = useContext(SuggestionsContext);
  if (!context)
    throw new Error("useSuggestions must be used within a SuggestionsProvider");
  return context;
}

export function SuggestionsProvider({ children, initialSuggestions = {} }) {
  const names = initialSuggestions?.names || [];
  const descriptions = initialSuggestions?.descriptions || [];

  // If the array is empty, .map() just returns another empty array. It won’t throw an error.

  const suggestionsRef = useRef({
    names: new Map(
      names.map((r) => [
        r?.contentId?.toString(),
        { suggestionId: r._id?.toString?.(), status: r.status || "pending" },
      ]),
    ),
    descriptions: new Map(
      descriptions.map((r) => [
        r?.contentId?.toString(),
        { suggestionId: r._id?.toString?.(), status: r.status || "pending" },
      ]),
    ),
  });
  //map for fast lookups based on contentID

  // console.log("suggestionsRef in context", suggestionsRef);

  const hasSuggested = (type, contentId) => {
    const map = suggestionsRef.current[type];
    if (!map) return false;
    return map.has(contentId.toString());
  };

  const getSuggestionStatus = (type, contentId) => {
    const map = suggestionsRef.current[type];
    if (!map) return null;
    return map.get(contentId.toString())?.status ?? null;
  };

  const addSuggestion = (type, contentId, suggestionId, status = "pending") => {
    const map = suggestionsRef.current[type];
    if (!map) return;
    map.set(contentId.toString(), { suggestionId, status });
  };

  const deleteSuggestion = (type, contentId, suggestionId) => {
    // console.log(
    //   "delete suggestion type",
    //   type,
    //   "delete suggestion suggestionId",
    //   suggestionId,
    //   "delete contentID",
    //   contentId,
    // );

    const map = suggestionsRef.current[type];
    // console.log("in delete suggestion, this is map", map);
    if (!map) return;

    const value = map.get(contentId.toString());
    if (value && value.suggestionId === suggestionId) {
      map.delete(contentId.toString());
    }
  };

  return (
    <SuggestionsContext.Provider
      value={{
        suggestionsRef,
        hasSuggested,
        getSuggestionStatus,
        addSuggestion,
        deleteSuggestion,
      }}
    >
      {children}
    </SuggestionsContext.Provider>
  );
}

//  suggestionsRef usage
// const { suggestionsRef } = useSuggestions();
// console.log(suggestionsRef.current.names); // Map of name suggestions

// hasSuggested and Add Suggestion
// if (!hasSuggested("names", contentId)) {
//   addSuggestion("names", contentId, suggestionId, "pending");
// }

//  status usage
// const status = getStatus("users", userId);
