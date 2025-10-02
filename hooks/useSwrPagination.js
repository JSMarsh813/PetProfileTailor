import useSWRInfinite from "swr/infinite";
import { useLikes } from "@/context/LikesContext";
useLikes;

const fetcher = (key) => {
  let url, options;
  if (Array.isArray(key)) {
    [url, options] = key;
  } else {
    url = key;
    options = {};
  }

  const hasBody = options?.body && Object.keys(options.body).length > 0;

  return fetch(url, {
    method: hasBody ? options?.method || "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: hasBody ? JSON.stringify(options.body) : undefined,
  }).then((res) => res.json());
};
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
  restrictSwrToLikedNames,
}) {
  // SWR key function

  console.log(
    "restrictSwrToLikedNames in swr pagination",
    restrictSwrToLikedNames,
  );
  let likedIds = [];

  if (restrictSwrToLikedNames) {
    const { getLikedIds } = useLikes();
    likedIds = getLikedIds(dataType) || null;
    console.log("likedIds in swr pagination", likedIds);
  }

  // if restrict to liked content but there are no likes, return early

  console.log(
    "restrictSwrToLikedNames",
    restrictSwrToLikedNames,
    "likedIds",
    likedIds,
  );
  if (
    (restrictSwrToLikedNames && likedIds === null) ||
    (restrictSwrToLikedNames && likedIds.length === 0)
  ) {
    return {
      data: [],
      isLoading: false,
      error: null,
      totalItems: 0,
      totalPagesInDatabase: 0,
      size: 0,
      setSize: () => {},
      isValidating: false,
      mutate: () => {},
    };
  }
  console.log("Fetching liked IDs for", dataType, likedIds);

  const getKey = (index, previousPageData) => {
    if (previousPageData && !previousPageData.data?.length) return null; // no more data
    if (index === undefined) return null; // stop fetching
    const page = index + 1; // SWR index starts at 0, but our API pages start at 1
    let url = "";
    if (dataType === "names") {
      url = `/api/names/swr?page=${page}&sortingproperty=${sortingProperty}&sortingvalue=${sortingValue}`;
    } else if (dataType === "descriptions") {
      url = `/api/description/swr?page=${page}&sortingproperty=${sortingProperty}&sortingvalue=${sortingValue}`;
    }
    // else if (dataType === "individualNames") {
    //   url = `/api/names/check-if-content-exists/${contentIdentifier}`;
    // }
    // POST in case likedIds is big, the method is decided in the fetchers fetch function
    const body = {};
    if (tags?.length) body.tags = tags;
    if (profileUserId) body.profileUserId = profileUserId;
    if (likedIds?.length || likedIds === null) body.likedIds = likedIds;

    return [url, Object.keys(body).length ? { body } : {}];
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
