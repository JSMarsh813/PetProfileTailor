"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const LikesContext = createContext(null);

export function useLikes() {
  const context = useContext(LikesContext);
  if (!context) throw new Error("useLikes must be used within a LikesProvider");
  return context;
}

export function LikesProvider({ children }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const likesRef = useRef({ names: new Map(), descriptions: new Map() });
  const recentLikesRef = useRef({}); // track like adjustments for this session
  // object keyed by contentId, with values -1, 0, or 1
  // { [nameId]: 1 | 0 | -1 }
  // tracks if the likes count has to be updated, important for if the user navigates backwards

  useEffect(() => {
    if (status === "loading") return;

    if (!userId) {
      // reset likes when logged out
      likesRef.current = { names: new Map(), descriptions: new Map() };
      recentLikesRef.current = {};
      return;
    }

    // fetch likes for the logged-in user
    fetch("/api/user/likes", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const names = data?.names || [];
        const descriptions = data?.descriptions || [];

        likesRef.current = {
          names: new Map(names.map((r) => [r.contentId.toString(), null])),
          descriptions: new Map(
            descriptions.map((r) => [r.contentId.toString(), null]),
          ),
        };

        recentLikesRef.current = {};
      })
      .catch(console.error);
  }, [userId, status]);

  const getLikedIds = (type) => {
    return Array.from(likesRef.current[type]?.keys() || []);
  };

  // console.log("likesRef in context", likesRef);

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
    // console.log(
    //   "delete like type",
    //   type,

    //   "delete contentID",
    //   contentId,
    // );
    likesRef.current[type]?.delete(contentId.toString());
  };

  return (
    <LikesContext.Provider
      value={{
        likesRef,
        getLikedIds,
        recentLikesRef,
        hasLiked,
        addLike,
        deleteLike,
      }}
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
