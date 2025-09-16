import useSWRInfinite from "swr/infinite";

const fetcher = (url) => fetch(url).then((res) => res.json());
const ITEMS_PER_FETCH = 100; // number of items per DB chunk

/**
 * Hook for SWR pagination with DB chunking
 *
 * @param {number} currentUiPage - current UI page number (1-based)
 * @param {number} itemsPerUiPage - items per UI page
 * @param {string[]} tags - array of selected tag IDs
 * @param {string} sortingproperty - Mongo field to sort by
 * @param {number} sortingvalue - 1 or -1
 */
export function useSwrPagination({
  dataType,
  currentUiPage,
  itemsPerUiPage,
  tags,
  sortingProperty,
  sortingValue,
  contentIdentifier,
  profileUserId,
}) {
  // SWR key function

  const getKey = (index, previousPageData) => {
    if (previousPageData && !previousPageData.data?.length) return null; // no more data
    if (index === undefined) return null; // stop fetching
    const page = index + 1; // SWR index starts at 0, but our API pages start at 1
    let url = "";
    if (dataType === "names") {
      url = `/api/names/swr/swr?page=${page}&sortingproperty=${sortingProperty}&sortingvalue=${sortingValue}`;
    } else if (dataType === "descriptions") {
      url = `/api/description/swr/swr?page=${page}&sortingproperty=${sortingProperty}&sortingvalue=${sortingValue}`;
    } else if (dataType === "individualNames") {
      url = `/api/names/findByName/${contentIdentifier}`;
    }

    if (tags?.length) url += `&tags=${tags.join(",")}`;
    if (profileUserId?.length) url += `&profileUserId=${profileUserId}`;
    return url;
  };

  const { data, error, size, isLoading, isValidating, setSize, mutate } =
    useSWRInfinite(getKey, fetcher);

  // Flatten all fetched DB chunks
  const allItems = data ? data.flatMap((chunk) => chunk?.data ?? []) : [];
  // (chunk?.data) prevents the crash if a chunk is undefined.

  // Total docs from API metadata
  const totalItems = data?.[0]?.totalDocs || 0;
  const totalPagesInDatabase = Math.ceil(totalItems / itemsPerUiPage);

  console.log("SWR data:", data);
  console.log("SWR size:", size);
  console.log("hook return:", { allItems, totalItems, totalPagesInDatabase });

  return {
    data: allItems,
    isLoading: isLoading ?? !data,
    error,
    totalItems,
    totalPagesInDatabase,
    size,
    setSize,
    isValidating,
    mutate,
  };
}
