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
  const names = initialReports?.names || [];
  const descriptions = initialReports?.descriptions || [];
  const users = initialReports?.users || [];

  // If the array is empty, .map() just returns another empty array. It won’t throw an error.

  const reportsRef = useRef({
    names: new Map(
      names.map((r) => [
        r.contentid.toString(),
        { reportId: r._id?.toString?.(), status: r.status || "pending" },
      ]),
    ),
    descriptions: new Map(
      descriptions.map((r) => [
        r.contentid.toString(),
        { reportId: r._id?.toString?.(), status: r.status || "pending" },
      ]),
    ),
    users: new Map(
      users.map((r) => [
        r.contentid.toString(),
        { reportId: r._id?.toString?.(), status: r.status || "pending" },
      ]),
    ),
  });
  //map for fast lookups based on contentID

  console.log("reportsRef in context", reportsRef);

  const hasReported = (type, contentId) => {
    const map = reportsRef.current[type];
    if (!map) return false;
    return map.has(contentId.toString());
  };

  const getStatus = (type, contentId) => {
    const map = reportsRef.current[type];
    if (!map) return null;
    return map.get(contentId.toString())?.status ?? null;
  };

  const addReport = (type, contentId, reportId, status = "pending") => {
    const map = reportsRef.current[type];
    if (!map) return;
    map.set(contentId.toString(), { reportId, status });
  };

  const deleteReport = (type, contentId, reportId) => {
    console.log(
      "delete report type",
      type,
      "delete report reportId",
      reportId,
      "delete contentID",
      contentId,
    );

    const map = reportsRef.current[type];
    console.log("in delete report, this is map", map);
    if (!map) return;

    const value = map.get(contentId.toString());
    if (value && value.reportId === reportId) {
      map.delete(contentId.toString());
    }
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
//   addReport("names", contentId, reportId, "pending");
// }

//  status usage
// const status = getStatus("users", userId);
