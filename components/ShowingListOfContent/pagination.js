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
    <section className="pagination-navigation flex flex-row min-w-0 lg:flex-content bg-violet-800 place-content-between text-violet-900 font-bold pt-2 border-x-4 border-darkPurple">
      {/* items per page */}
      <div className="my-auto">
        <select
          id="per-page"
          className="bg-violet-200  ml-2"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPageFunction(e.target.value)}
        >
          <option value="5">5</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="70">80</option>
          <option value="100">100</option>
        </select>
        <label
          className="text-white ml-2"
          htmlFor="per-page"
        >
          Per Page
        </label>
      </div>

      <div className="flex-row md:flex m-2">
        <button
          className="prevpage"
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

        <div className="lg:w-full">
          {arrayOfPageNumbers.map((number) => {
            if (number > page + 4 || number < page - 5) {
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
        </div>

        <button
          aria-label="nextpage"
          className="nextpage"
          type="submit"
          onClick={() => lastPageHandler(page)}
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            className="text-3xl mt-2 md:mt-0"
            color={`${page < filteredListLastPage ? "yellow" : "grey"}`}
          />
        </button>
      </div>
    </section>
  );
}
