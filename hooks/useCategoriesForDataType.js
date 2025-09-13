import { useCategAndTags } from "@/context/CategoriesAndTagsContext";

export function useCategoriesForDataType(dataType) {
  const { nameCateg, descrCateg } = useCategAndTags();

  if (dataType === "name") return nameCateg;
  if (dataType === "description") return descrCateg;
  return [];
}
