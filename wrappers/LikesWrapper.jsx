"use client";

import { useEffect, useState } from "react";

import { LikesProvider } from "@/context/LikesContext";

export default function LikesWrapper({ children }) {
  const [likes, setLikes] = useState(null);

  useEffect(() => {
    fetch("/api/user/likes")
      .then((res) => res.json())
      .then(setLikes)
      .catch(console.error);
  }, []);

  if (!likes) return null;

  return <LikesProvider initialLikes={likes}>{children}</LikesProvider>;
}
