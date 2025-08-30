import React, { useEffect, useState, useRef, useMemo } from "react";
import GeneralButton from "../../components/ReusableSmallComponents/buttons/GeneralButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

export default function Pagination({
  itemsPerPage,
  setItemsPerPageFunction,
  setPageFunction,
  setSize,
  size,
  currentUiPage,
  setCurrentUiPage,
  setSortingLogicFunction,
  totalPagesInDatabase,
  currentSwrPage,
  totalItems,
  amountOfDataLoaded, // Add this prop to get the actual loaded items
}) {
  const [windowStart, setWindowStart] = useState(1); // first page of the visible window

  const [totalLoadedPages, setTotalLoadedPages] = useState(0);
  const windowSize = 5; // max number of visible pages

  const ITEMS_PER_SWR_PAGE = 50;

  useEffect(() => {
    const calculatedTotalLoadedPages = Math.ceil(
      amountOfDataLoaded / itemsPerPage,
    );

    setTotalLoadedPages(calculatedTotalLoadedPages);
  }, [amountOfDataLoaded, size, itemsPerPage]);

  function howManyPagesHaveBeenLoaded(totalItems, itemsPerPage) {
    return Math.ceil(totalItems / itemsPerPage);
  }

  // useEffect(() => {
  //   // Slide window if currentPage moves outside visible range
  //   if (currentUiPage >= windowStart + windowSize) {
  //     setWindowStart(currentUiPage - windowSize + 1);
  //   } else if (currentUiPage < windowStart) {
  //     setWindowStart(currentUiPage);
  //   }

  //   // If user navigates to last page in current chunk, load next SWR chunk
  //   if (
  //     currentUiPage === totalLoadedPages &&
  //     totalLoadedPages < totalPagesInDatabase
  //   ) {
  //     loadNextChunk?.();
  //   }
  // }, [currentUiPage, windowStart, totalPagesInDatabase]);

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

  let lastPageNumber = pageNumbers.slice(-1).toString();

  const lastPageHandler = () => {
    // If we're at the last loaded page and there's more data to fetch

    if (
      currentUiPage >= totalLoadedPages &&
      totalLoadedPages < totalPagesInDatabase
    ) {
      // Trigger SWR to fetch next chunk
      setSize(size + 1);
      return;
    }
    // If we have more pages loaded, just move to the next UI page
    if (currentUiPage < totalLoadedPages) {
      updateWindow(currentUiPage + 1);
      setCurrentUiPage(currentUiPage + 1);
    }
    setPageFunction(currentSwrPage + 1);
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
    setCurrentUiPage(page);
    updateWindow(page);
    // Slide the window if page goes beyond visible range
    if (page >= windowStart + windowSize) {
      setWindowStart(page - windowSize + 1);
    } else if (page < windowStart) {
      setWindowStart(page);
    }
    // Check if we need to load more data before navigating
    if (page >= totalLoadedPages && totalLoadedPages < totalPagesInDatabase) {
      console.log("Need to load more data for page:", page);
      setSize(size + 1);
      // Don't set currentUiPage yet - let the SWR data load first
      return;
    }

    setCurrentUiPage(page);
  };
  return (
    <section className="pagination-navigation grid grid-rows-1 min-w-0  bg-violet-800 text-violet-900 font-bold pt-2 sm:border-x-4 border-darkPurple">
      {/* sorting logic*/}
      <div className="inline  my-auto pb-3 ">
        {/* wrapping the selects in sections & inline-block keeps the per page and sort by labels from wrapping weirdly at smaller sizes */}

        {/* Per page */}
        <section className="inline-block">
          <select
            id="per-page"
            className="bg-violet-200  ml-2"
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
          <select
            id="per-page"
            className="bg-violet-200  ml-2 p-2"
            onChange={(e) => setSortingLogicFunction(e.target.value)}
          >
            <option value="_id,-1">Newest</option>
            <option value="_id,1">Oldest </option>
            <option value="likedbycount,-1">Most Liked</option>
            <option value="likedbycount,1">Least Liked</option>
          </select>

          {/* <label
            className="text-white ml-2"
            htmlFor="per-page"
          >
            Sort by
          </label> */}

          <span className="text-white"> Total Matches: {totalItems} </span>
        </section>
      </div>

      {/* PAGINATION ARROWS */}
      <div className="flex justify-center mb-3 border-t-2 b-white pt-3">
        <button
          className="prevpage "
          aria-label="prevpage"
          disabled={currentSwrPage == 1}
          type="submit"
          onClick={() => setPageFunction(currentSwrPage - 1)}
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-3xl fa-rotate-180"
            color={`${currentSwrPage == 1 ? "grey" : "yellow"}`}
          />
        </button>

        {pageNumbers.map((number) => {
          // if (number >  + 2 || number < currentSwrPage - 3) {
          //   return;
          // }

          return (
            <GeneralButton
              text={number}
              key={number}
              active={number === currentUiPage}
              className={`py-1 px-4 mx-2 mt-1`}
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
          onClick={() => lastPageHandler(currentSwrPage)}
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-3xl mt-2 md:mt-0 "
            color={`${currentUiPage < totalLoadedPages ? "yellow" : "grey"}`}
          />
        </button>
      </div>
    </section>
  );
}
