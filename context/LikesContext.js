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

  const likesRef = useRef({
    names: new Map(
      names.map((r) => [
        r.contentid.toString(),
        { likeId: r._id?.toString?.(), status: r.status || "pending" },
      ]),
    ),
    descriptions: new Map(
      descriptions.map((r) => [
        r.contentid.toString(),
        { likeId: r._id?.toString?.(), status: r.status || "pending" },
      ]),
    ),
  });
  //map for fast lookups based on contentID

  console.log("likesRef in context", likesRef);

  const hasLiked = (type, contentId) => {
    const map = likesRef.current[type];
    if (!map) return false;
    return map.has(contentId.toString());
  };

  const getLikeStatus = (type, contentId) => {
    const map = likesRef.current[type];
    if (!map) return null;
    return map.get(contentId.toString())?.status ?? null;
  };

  const addLike = (type, contentId, likeId, status = "pending") => {
    const map = likesRef.current[type];
    if (!map) return;
    map.set(contentId.toString(), { likeId, status });
  };

  const deleteLike = (type, contentId, likeId) => {
    console.log(
      "delete like type",
      type,
      "delete like likeId",
      likeId,
      "delete contentID",
      contentId,
    );

    const map = likesRef.current[type];
    console.log("in delete like, this is map", map);
    if (!map) return;

    const value = map.get(contentId.toString());
    if (value && value.likeId === likeId) {
      map.delete(contentId.toString());
    }
  };

  return (
    <LikesContext.Provider
      value={{ likesRef, hasLiked, getLikeStatus, addLike, deleteLike }}
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
