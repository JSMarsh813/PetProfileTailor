"use client";

import { SessionProvider } from "next-auth/react";

export function SessionProviderWrapper({ session, children }) {
  return (
    <SessionProvider
      session={session}
      limit={1}
    >
      {children}
    </SessionProvider>
  );
}
