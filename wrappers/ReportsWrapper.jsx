"use client";

import { ReportsProvider } from "@/context/ReportsContext";

export default function ReportsWrapper({ children, initialReports }) {
  return (
    <ReportsProvider initialReports={initialReports}>
      {children}
    </ReportsProvider>
  );
}
