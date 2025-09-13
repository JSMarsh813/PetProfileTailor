// components/ProvidersWrapper.js
"use client";

import { CategoriesAndTagsProvider } from "@/context/CategoriesAndTagsContext";

export default function ProvidersWrapper({ nameCateg, descrCateg, children }) {
  return (
    <CategoriesAndTagsProvider
      nameCateg={nameCateg}
      descrCateg={descrCateg}
    >
      {children}
    </CategoriesAndTagsProvider>
  );
}
