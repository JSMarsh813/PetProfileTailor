"use client";

import { createContext, useContext, useRef } from "react";

const LikesContext = createContext(null);

export function useLikes() {
  const context = useContext(LikesContext);
  if (!context) throw new Error("useLikes must be used within a LikesProvider");
  return context;
}

export function LikesProvider({ children, initialLikes = {} }) {
  const names = initialLikes.names || [];
  const descriptions = initialLikes.descriptions || [];

  // If the array is empty, .map() just returns another empty array. It won’t throw an error.

  // Map keys = contentId, values are irrelevant
  //map for fast lookups based on contentID
  const likesRef = useRef({
    names: new Map(names.map((r) => [r.contentId.toString(), null])),
    descriptions: new Map(
      descriptions.map((r) => [r.contentId.toString(), null]),
    ),
  });

  console.log("likesRef in context", likesRef);

  const hasLiked = (type, contentId) => {
    return likesRef.current[type]?.has(contentId.toString()) ?? false;
    // has returns a boolean, true or false
  };

  // const getLikeStatus = (type, contentId) => {
  //   const map = likesRef.current[type];
  //   if (!map) return null;
  //   return map.get(contentId.toString())?.status ?? null;
  // };

  const addLike = (type, contentId) => {
    likesRef.current[type]?.set(contentId.toString(), null);
  };

  const deleteLike = (type, contentId) => {
    console.log(
      "delete like type",
      type,

      "delete contentID",
      contentId,
    );
    likesRef.current[type]?.delete(contentId.toString());
  };

  // track like adjustments for this session
  const recentLikesRef = useRef({});
  // object keyed by contentId, with values -1, 0, or 1
  // { [nameId]: 1 | 0 | -1 }
  // tracks if the likes count has to be updated, important for if the user navigates backwards

  return (
    <LikesContext.Provider
      value={{ likesRef, recentLikesRef, hasLiked, addLike, deleteLike }}
    >
      {children}
    </LikesContext.Provider>
  );
}

//  likesRef usage
// const { likesRef } = useLikes();
// console.log(likesRef.current.names); // Map of name likes

// hasLiked and Add Like
// if (!hasLiked("names", contentId)) {
//   addLike("names", contentId, likeId, "pending");
// }

//  status usage
// const status = getLikeStatus("users", userId);
