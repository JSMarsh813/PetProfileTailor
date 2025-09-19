"use client";
import { createContext, useContext, useMemo } from "react";

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
  const nameTagList = useMemo(() => {
    const allTags = nameCateg.flatMap((cat) =>
      cat.tags.map((tag) => ({ label: tag.tag, value: tag._id })),
    );
    return Array.from(new Map(allTags.map((tag) => [tag.value, tag])).values()); // gets rid of duplicates, keyed by value so if 2 have the same value, only one will be added
  }, [nameCateg]);

  const descriptionTagList = useMemo(() => {
    const allTags = descrCateg.flatMap((cat) =>
      cat.tags.map((tag) => ({ label: tag.tag, value: tag._id })),
    );
    return Array.from(new Map(allTags.map((tag) => [tag.value, tag])).values());
  }, [descrCateg]);

  return (
    <CategoriesAndTagsContext.Provider
      value={{ descrCateg, nameCateg, nameTagList, descriptionTagList }}
    >
      {children}
    </CategoriesAndTagsContext.Provider>
  );
}
