"use client";

import { useEffect, useState } from "react";

import { ReportsProvider } from "@/context/ReportsContext";

export default function ReportsWrapper({ children }) {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    fetch("/api/user/reports", { cache: "no-store" })
      .then((res) => res.json())
      .then(setReports)
      .catch(console.error);
  }, []);

  return <ReportsProvider initialReports={reports}>{children}</ReportsProvider>;
}
