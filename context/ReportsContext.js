"use client";

import { createContext, useContext, useRef } from "react";

const ReportsContext = createContext(null);

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context)
    throw new Error("useReports must be used within a ReportsProvider");
  return context;
}

export function ReportsProvider({ children, initialReports = {} }) {
  const names = initialReports.names || [];
  const descriptions = initialReports.descriptions || [];
  const users = initialReports.users || [];

  // If the array is empty, .map() just returns another empty array. It won’t throw an error.

  const reportsRef = useRef({
    names: new Map(
      names.map((r) => [r.contentid.toString(), r.status || "pending"]),
    ),
    descriptions: new Map(
      descriptions.map((r) => [r.contentid.toString(), r.status || "pending"]),
    ),
    users: new Map(
      users.map((r) => [r.contentid.toString(), r.status || "pending"]),
    ),
  });
  //map for fast lookups based on userID

  console.log("reportsRef in context", reportsRef);

  const hasReported = (type, id) => {
    const map = reportsRef.current[type];
    if (!map) return false; // type doesn’t exist
    return map.has(id.toString());
  };

  const getStatus = (type, id) => {
    const map = reportsRef.current[type];
    if (!map) return null;
    return map.get(id.toString()) ?? null;
  };

  const addReport = (type, id, status = "pending") => {
    const map = reportsRef.current[type];
    if (!map) return;
    map.set(id.toString(), status);
  };

  const deleteReport = (type, id) => {
    const map = reportsRef.current[type];
    if (!map) return;
    map.delete(id.toString());
  };

  return (
    <ReportsContext.Provider
      value={{ reportsRef, hasReported, getStatus, addReport, deleteReport }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

//  reportsRef usage
// const { reportsRef } = useReports();
// console.log(reportsRef.current.names); // Map of name reports

// hasReported and Add Report
// if (!hasReported("names", contentId)) {
//   addReport("names", contentId, "pending");
// }

//  status usage
// const status = getStatus("users", userId);
