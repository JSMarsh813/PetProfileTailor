"use client";

import { SessionProvider } from "next-auth/react";

export function SessionProviderWrapper({ session, children }) {
  // console.log("session in session provider wrapper", session);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
