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
  console.log("descrCateg", descrCateg, "nameCateg", nameCateg);

  const nameTagList = useMemo(() => {
    return nameCateg.flatMap((cat) =>
      cat.tags.map((tag) => ({ label: tag.tag, value: tag._id })),
    );
  }, [nameCateg]);

  const descriptionTagList = useMemo(() => {
    return descrCateg.flatMap((cat) =>
      cat.tags.map((tag) => ({ label: tag.tag, value: tag._id })),
    );
  }, [nameCateg]);

  return (
    <CategoriesAndTagsContext.Provider
      value={{ descrCateg, nameCateg, nameTagList, descriptionTagList }}
    >
      {children}
    </CategoriesAndTagsContext.Provider>
  );
}
