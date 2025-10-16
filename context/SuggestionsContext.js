"use client";

import { createContext, useContext, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

const SuggestionsContext = createContext(null);

export function useSuggestions() {
  const context = useContext(SuggestionsContext);
  if (!context)
    throw new Error("useSuggestions must be used within a SuggestionsProvider");
  return context;
}

export function SuggestionsProvider({ children, initialSuggestions = {} }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const suggestionsRef = useRef({ names: new Map(), descriptions: new Map() });

  // If the array is empty, .map() just returns another empty array. It won’t throw an error.

  useEffect(() => {
    if (status === "loading") return;

    if (!userId) {
      suggestionsRef.current.names.clear();
      suggestionsRef.current.descriptions.clear();
      return;
    }

    const controller = new AbortController();

    fetch("/api/user/suggestions", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!controller.signal.aborted) {
          const { names = [], descriptions = [] } = data;
          suggestionsRef.current.names = new Map(
            names.map((r) => [
              r?.contentId?.toString(),
              {
                suggestionId: r._id?.toString?.(),
                status: r.status || "pending",
              },
            ]),
          );
          suggestionsRef.current.descriptions = new Map(
            descriptions.map((r) => [
              r?.contentId?.toString(),
              {
                suggestionId: r._id?.toString?.(),
                status: r.status || "pending",
              },
            ]),
          );
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
    return () => controller.abort();
  }, [userId, status]);

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
