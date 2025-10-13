"use client";

import { ReportsProvider } from "@/context/ReportsContext";

export default function ReportsWrapper({ children }) {
  return <ReportsProvider>{children}</ReportsProvider>;
}
