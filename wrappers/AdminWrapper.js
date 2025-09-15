"use client";

import { AdminProvider } from "@/context/AdminContext";

export default function AdminWrapper({ children, isAdmin }) {
  return <AdminProvider isAdmin={isAdmin}>{children}</AdminProvider>;
}
