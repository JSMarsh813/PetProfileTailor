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
  currentUiPage,
  itemsPerUiPage,
  tags,
  sortingproperty,
  sortingvalue,
}) {
  //   // Compute indices in the full list
  //   const uiStartIndex = (currentUiPage - 1) * itemsPerUiPage;
  //   const uiEndIndex = uiStartIndex + itemsPerUiPage - 1;

  //   // Compute which DB chunks we need
  //   const startDbPage = Math.floor(uiStartIndex / ITEMS_PER_FETCH) + 1;
  //   const endDbPage = Math.floor(uiEndIndex / ITEMS_PER_FETCH) + 1;

  //   const neededPages = [];
  //   for (let p = startDbPage; p <= endDbPage; p++) {
  //     neededPages.push(p);
  //   }

  // SWR key function
  const getKey = (index) => {
    // const page = neededPages[index];
    // if (!page) return null; // stop fetching
    if (index === undefined) return null; // stop fetching
    const page = index + 1; // SWR index starts at 0, but our API pages start at 1
    let url = `/api/names/swr/swr?page=${page}&sortingproperty=${sortingproperty}&sortingvalue=${sortingvalue}`;
    if (tags?.length) url += `&tags=${tags.join(",")}`;
    return url;
  };

  const { data, error, size, isLoading, isValidating, setSize, mutate } =
    useSWRInfinite(getKey, fetcher);

  if (!data & !error)
    return { items: [], isLoading: true, error, totalItems: 0, totalPages: 0 };

  // Flatten all fetched DB chunks
  const allItems = data
    ? data.flatMap((chunk) => (chunk?.data ? chunk.data : []))
    : [];
  // The optional chaining (chunk?.data) prevents the crash if a chunk is undefined.

  // Total docs from API metadata
  const totalItems = data[0]?.totalDocs || 0;
  const totalPagesInDatabase = Math.ceil(totalItems / itemsPerUiPage);
  const currentSwrPage = data?.[0]?.currentPage || 1;

  console.log("SWR data:", data);
  console.log("SWR size:", size);
  console.log("hook return:", { allItems, totalItems, totalPagesInDatabase });

  return {
    data: allItems,
    isLoading,
    error,
    totalItems,
    totalPagesInDatabase,
    size,
    setSize,
    currentSwrPage,
    isValidating,
    mutate,
  };
}
