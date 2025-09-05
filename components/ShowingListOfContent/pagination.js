import React, { useEffect, useState, useRef, useMemo } from "react";
import GeneralButton from "../../components/ReusableSmallComponents/buttons/GeneralButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import startCooldown from "../../utils/startCooldown";

export default function Pagination({
  itemsPerPage,
  setItemsPerPageFunction,
  setSize,
  size,
  currentUiPage,
  setCurrentUiPage,
  setSortingLogicFunction,
  totalPagesInDatabase,
  totalItems,
  amountOfDataLoaded, // Add this prop to get the actual loaded items
  remainingSortCooldown,
  sortingValue,
  sortingProperty,
}) {
  const paginationCooldownRef = useRef(null);
  const [remainingPaginationCooldown, setRemainingPaginationCooldown] =
    useState(0);

  const [windowStart, setWindowStart] = useState(1); // first page of the visible window

  const [totalLoadedPages, setTotalLoadedPages] = useState(0);
  const windowSize = 5; // max number of visible pages

  const startingItemCountForPage = Math.max(
    (currentUiPage - 1) * itemsPerPage + 1,
  );
  const endingItemCountForPage = Math.min(
    currentUiPage * itemsPerPage,
    totalItems,
  );

  useEffect(() => {
    const calculatedTotalLoadedPages = Math.ceil(
      amountOfDataLoaded / itemsPerPage,
    );

    setTotalLoadedPages(calculatedTotalLoadedPages);
  }, [amountOfDataLoaded, size, itemsPerPage]);

  const windowEnd = Math.min(windowStart + windowSize - 1, totalLoadedPages);

  // Make pageNumbers reactive using useMemo
  const pageNumbers = useMemo(() => {
    const numbers = [];

    for (let i = windowStart; i <= windowEnd; i++) {
      numbers.push(i);
    }

    return numbers;
  }, [windowStart, windowEnd, totalLoadedPages]);
  // useMemo only recalculates when the dependencies actually change, not on every render

  const lastPageHandler = () => {
    // If we have more pages loaded, just move to the next UI page

    if (currentUiPage < totalLoadedPages) {
      updateWindow(currentUiPage + 1);
      setCurrentUiPage(currentUiPage + 1);
    }

    if ((remainingPaginationCooldown > 0) & (currentUiPage > totalLoadedPages))
      return;

    // If we're at the last loaded page and there's more data to fetch
    if (
      // we're going to pretend we're 2 pages ahead, so we can have the next pages loaded ahead of time
      // so theres no flicker of the pagination > button being greyed out
      currentUiPage + 2 >= totalLoadedPages &&
      totalLoadedPages < totalPagesInDatabase
    ) {
      // Trigger SWR to fetch next chunk
      setSize(size + 1);
      startCooldown(paginationCooldownRef, setRemainingPaginationCooldown, 15);
      return;
    }
  };

  const updateWindow = (page) => {
    // Slide the window if page goes beyond visible range
    if (page >= windowStart + windowSize) {
      setWindowStart(page - windowSize + 1);
    } else if (page < windowStart) {
      setWindowStart(page);
    }
  };

  const handleClickPage = (page) => {
    if (page >= totalLoadedPages && totalLoadedPages < totalPagesInDatabase) {
      setSize(size + 1); // trigger SWR fetch for more pages
    }
    setCurrentUiPage(page);
    updateWindow(page);
  };
  return (
    <section className="pagination-navigation grid grid-rows-1 min-w-0 my-2  border-t border-violet-300 text-violet-900 font-bold pt-2 ">
      {/* sorting logic*/}
      <div className="inline  my-auto pb-3 ">
        {/* wrapping the selects in sections & inline-block keeps the per page and sort by labels from wrapping weirdly at smaller sizes */}

        {/* Per page */}
        <section className="inline-block">
          <select
            id="per-page"
            className="bg-darkPurple text-subtleWhite ml-2"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPageFunction(e.target.value)}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <label
            className="text-white ml-2"
            htmlFor="per-page"
          >
            Per Page
          </label>
        </section>
        {/* sort by */}
        <section className="inline-block">
          {remainingSortCooldown > 0 ? (
            <select
              className="bg-darkPurple text-subtleWhite ml-2 p-2 opacity-50 cursor-not-allowed border rounded w-56"
              disabled
            >
              <option>
                Please wait {remainingSortCooldown} second
                {remainingSortCooldown > 1 ? "s" : ""}
              </option>
            </select>
          ) : (
            <select
              id="per-page"
              className="bg-darkPurple text-subtleWhite ml-2 p-2 border rounded w-40"
              onChange={(e) => setSortingLogicFunction(e.target.value)}
              value={`${sortingProperty},${sortingValue}`}
              // so we remember what the user selected after the timeout
            >
              <option value="_id,-1">Newest</option>
              <option value="_id,1">Oldest</option>
              <option value="likedbycount,-1">Most Liked</option>
              <option value="likedbycount,1">Least Liked</option>
            </select>
          )}

          {/* <label
            className="text-white ml-2"
            htmlFor="per-page"
          >
            Sort by
          </label> */}
        </section>
      </div>

      {/* PAGINATION ARROWS */}
      {remainingPaginationCooldown !== 0 &&
        currentUiPage === totalLoadedPages && (
          <p className="text-subtleWhite mx-auto">
            {" "}
            {`Please wait ${remainingPaginationCooldown} secs`}
          </p>
        )}

      <div className="flex justify-center my-auto items-center ">
        <button
          className="prevpage"
          aria-label="prevpage"
          disabled={currentUiPage == 1}
          type="submit"
          onClick={() => {
            if (currentUiPage > 1) {
              setCurrentUiPage(currentUiPage - 1);
              updateWindow(currentUiPage - 1);
            }
          }}
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-[38px] fa-rotate-180 leading-none "
            color={`${currentUiPage === 1 ? "grey" : "rgb(221 214 254)"}`}
          />
        </button>

        {pageNumbers.map((number) => {
          return (
            <GeneralButton
              text={number}
              key={number}
              subtle={true}
              active={number === currentUiPage}
              className={` px-4 mx-2`}
              onClick={
                () => handleClickPage(number)

                // number == lastPageNumber
                //   ? clickOnLastNumber(number)
                //   : setPageFunction(number)
              }
            />
          );
        })}

        <button
          aria-label="nextpage"
          className="nextpage aligncenter"
          type="submit"
          onClick={() => lastPageHandler()}
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-[38px]   "
            color={`${
              currentUiPage < totalLoadedPages ? "rgb(221 214 254)" : "grey" //subtle white or grey
            }`}
          />
        </button>
      </div>
      <span className="text-white mx-auto mb-2">
        {`${startingItemCountForPage}-${endingItemCountForPage} of ${totalItems} Items`}
      </span>
    </section>
  );
}
