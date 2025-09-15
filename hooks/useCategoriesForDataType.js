import { useCategAndTags } from "@/context/CategoriesAndTagsContext";

export function useCategoriesForDataType(dataType) {
  const { nameCateg, descrCateg, nameTagList, descriptionTagList } =
    useCategAndTags();

  if (dataType === "names") {
    return { categoriesWithTags: nameCateg, tagList: nameTagList };
  }

  if (dataType === "descriptions") {
    return { categoriesWithTags: descrCateg, tagList: descriptionTagList };
  }

  return { categoriesWithTags: [], tagList: [] };
}
