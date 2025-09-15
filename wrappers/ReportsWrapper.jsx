"use client";

import { ReportsProvider } from "@/context/ReportsContext";

export default function ReportsWrapper({ initialReports }) {
  return (
    <ReportsProvider initialReports={initialReports}>
      {children}
    </ReportsProvider>
  );
}
