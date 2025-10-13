"use client";

import { LikesProvider } from "@/context/LikesContext";

export default function LikesWrapper({ children }) {
  return <LikesProvider>{children}</LikesProvider>;
}
