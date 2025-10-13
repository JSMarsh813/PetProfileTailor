"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AdminContext = createContext(null);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}

export function AdminProvider({ children, isAdminServer }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(isAdminServer);

  useEffect(() => {
    if (status === "loading") return;

    const role = session?.user?.role;
    const isActive = session?.user?.status === "active";
    const nextIsAdmin = role === "admin" && isActive;

    if (status === "authenticated" && !nextIsAdmin) {
      router.push("/dashboard");
    }

    if (nextIsAdmin !== isAdmin) {
      setIsAdmin(nextIsAdmin); // update context value only if changed
    }
  }, [session, status, router, isAdmin]);

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
