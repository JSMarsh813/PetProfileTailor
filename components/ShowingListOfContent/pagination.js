import React, { useEffect, useState, useRef } from "react";
import GeneralButton from "../../components/ReusableSmallComponents/buttons/GeneralButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

export default function Pagination({
  page,
  itemsPerPage,
  filteredListLastPage,
  isAtEnd,
  setItemsPerPageFunction,
  setPageFunction,
  setSizeFunction,
  size,
  filterednameslength,
  setSortingLogicFunction,
}) {
  const numberOfPages = Math.ceil(filterednameslength / itemsPerPage);

  let arrayOfPageNumbers = [];
  for (let i = 1; i <= numberOfPages; i++) {
    arrayOfPageNumbers.push(i);
  }

  let lastPageNumber = arrayOfPageNumbers.slice(-1).toString();

  const lastPageHandler = () => {
    if (!isAtEnd) {
      setSizeFunction(size + 1);
      // && mutate();
    }
    if (page >= filteredListLastPage) {
      return;
    }
    setPageFunction(page + 1);
  };

  const clickOnLastNumber = (number) => {
    setPageFunction(number);
    setSizeFunction(size + 1);
    //  && mutate();
  };

  return (
    <section className="pagination-navigation grid grid-rows-1 min-w-0  bg-violet-800 text-violet-900 font-bold pt-2 sm:border-x-4 border-darkPurple">
      {/* sorting logic*/}
      <div className="inline my-auto pb-3 ">
        {/* wrapping the selects in sections & inline-block keeps the per page and sort by labels from wrapping weirdly at smaller sizes */}

        {/* Per page */}
        <section className="inline-block">
          <select
            id="per-page"
            className="bg-violet-200  ml-2"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPageFunction(e.target.value)}
          >
            <option value="5">5</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
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
            <option value="likedbylength,-1">Most Liked</option>
            <option value="likedbylength,1">Least Liked</option>
          </select>

          <label
            className="text-white ml-2"
            htmlFor="per-page"
          >
            Sort by
          </label>
        </section>
      </div>

      {/* PAGINATION ARROWS */}
      <div className=" flex justify-center mb-3 border-t-2 b-white pt-3">
        <button
          className="prevpage "
          aria-label="prevpage"
          disabled={page == 1}
          type="submit"
          onClick={() => setPageFunction(page - 1)}
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-3xl fa-rotate-180"
            color={`${page == 1 ? "grey" : "yellow"}`}
          />
        </button>

        {arrayOfPageNumbers.map((number) => {
          if (number > page + 2 || number < page - 3) {
            return;
          }

          return (
            <GeneralButton
              text={number}
              key={number}
              className={`py-1 px-4 mx-2 mt-1 ${
                number == page && "bg-indigo-300 border-indigo-600"
              }`}
              onClick={() =>
                number == lastPageNumber
                  ? clickOnLastNumber(number)
                  : setPageFunction(number)
              }
            />
          );
        })}

        <button
          aria-label="nextpage"
          className="nextpage aligncenter"
          type="submit"
          onClick={() => lastPageHandler(page)}
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-3xl mt-2 md:mt-0 "
            color={`${page < filteredListLastPage ? "yellow" : "grey"}`}
          />
        </button>
      </div>
    </section>
  );
}
