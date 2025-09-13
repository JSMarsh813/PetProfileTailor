"use client";

import { createContext, useContext, useRef } from "react";

const CategoriesAndTagsContext = createContext(null);

export function useCategAndTags() {
  const context = useContext(CategoriesAndTagsContext);
  if (!context)
    throw new Error("useCategAndTags must be used within a ReportsProvider");
  return context;
}

export function CategoriesAndTagsProvider({
  children,
  descrCateg = [],
  nameCateg = [],
}) {
  console.log("descrCateg", descrCateg, "nameCateg", nameCateg);

  return (
    <CategoriesAndTagsContext.Provider value={{ descrCateg, nameCateg }}>
      {children}
    </CategoriesAndTagsContext.Provider>
  );
}
