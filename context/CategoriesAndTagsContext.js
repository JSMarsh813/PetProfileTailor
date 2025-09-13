// context/ReportsContext.js

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
  const descriptionCategRef = useRef(
    new Map(descrCateg.map((r) => [r._id.toString()])),
  );

  const nameCategRef = useRef(
    new Map(nameCateg.map((r) => [r._id.toString()])),
  );
  return (
    <CategoriesAndTagsContext.Provider
      value={{ descriptionCategRef, nameCategRef }}
    >
      {children}
    </CategoriesAndTagsContext.Provider>
  );
}
