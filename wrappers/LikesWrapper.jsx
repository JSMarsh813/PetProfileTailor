"use client";

import { useEffect, useState } from "react";

import { LikesProvider } from "@/context/LikesContext";
import { useSession } from "next-auth/react";

export default function LikesWrapper({ children }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [likes, setLikes] = useState({ names: [], descriptions: [] });

  useEffect(() => {
    //reactive for when the user signs in or out
    if (!userId) {
      setLikes({ names: [], descriptions: [] });
      return;
    }

    fetch("/api/user/likes")
      .then((res) => res.json())
      .then(setLikes)
      .catch(console.error);
  }, [userId]);

  if (!likes) return null;

  return <LikesProvider initialLikes={likes}>{children}</LikesProvider>;
}
