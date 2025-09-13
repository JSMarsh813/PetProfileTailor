"use client";

import { createContext, useContext, useRef } from "react";

const ReportsContext = createContext(null);

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context)
    throw new Error("useReports must be used within a ReportsProvider");
  return context;
}

export function ReportsProvider({ children, initialReports = [] }) {
  console.log("initialReports", initialReports);
  const reportsRef = useRef(
    new Map(
      initialReports.map((r) => [
        r.contentid.toString(),
        r.status ?? "pending",
      ]),
    ),
  );
  //map for fast lookups based on userID
  console.log("reportsRef in context", reportsRef);

  const hasReported = (id) => reportsRef.current.has(id.toString());
  const getStatus = (id) => {
    const key = id.toString();
    return reportsRef.current.has(key) ? reportsRef.current.get(key) : null;
  };

  const addReport = (id, status = "pending") =>
    reportsRef.current.set(id, status);

  return (
    <ReportsContext.Provider
      value={{ reportsRef, hasReported, getStatus, addReport }}
    >
      {children}
    </ReportsContext.Provider>
  );
}
