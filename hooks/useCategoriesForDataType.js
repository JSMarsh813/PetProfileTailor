import { useCategAndTags } from "@/context/CategoriesAndTagsContext";

export function useCategoriesForDataType(dataType) {
  const { nameCateg, descrCateg, nameTagList, descriptionTagList } =
    useCategAndTags();

  if (dataType === "name") {
    return { categoriesWithTags: nameCateg, tagList: nameTagList };
  }

  if (dataType === "description") {
    return { categoriesWithTags: descrCateg, tagList: descriptionTagList };
  }

  return { categoriesWithTags: [], tagList: [] };
}
