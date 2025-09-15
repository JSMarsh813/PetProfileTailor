"use client";

import { LikesProvider } from "@/context/LikesContext";

export default function LikesWrapper({ children, initialLikes }) {
  return <LikesProvider initialLikes={initialLikes}>{children}</LikesProvider>;
}
