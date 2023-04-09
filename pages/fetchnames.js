import React, { useEffect, useState } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import HeadersForNames from "../components/ShowingListOfContent/HeadersForNames";
import NameListingAsSections from "../components/ShowingListOfContent/NameListingAsSections";

import dbConnect from "../utils/db";
import Category from "../models/nameCategory";
import NameTag from "../models/NameTag";

import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/fetch";
import Pagination from "../components/ShowingListOfContent/pagination";
import CheckForMoreData from "../components/ReusableSmallComponents/buttons/CheckForMoreDataButton";
import Image from "next/image";

//getkey: accepts the index of the current page, as well as the data from the previous page.

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  dbConnect.connect();

  //grabbing category's

  const data = await Category.find().populate("tags");

  //grabbing Tags for name edit function

  const tagData = await NameTag.find();
  let tagListProp = tagData
    .map((tag) => tag)
    .reduce((sum, value) => sum.concat(value), []);

  return {
    props: {
      category: JSON.parse(JSON.stringify(data)),
      tagList: JSON.parse(JSON.stringify(tagListProp)),
      sessionFromServer: session,
    },
  };
};

export default function FetchNames({ category, sessionFromServer, tagList }) {
  // #### Info for nav menu

  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  // ##### end of section for nav menu

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [IsOpen, setIsOpen] = useState(true);
  const [tagFilters, setTagFiltersState] = useState([]);
  const [filterednames, setFilteredNames] = useState([]);
  const [page, setPage] = useState(1);
  // const [sortinglogicstring, setSortingLogicString] = useState("_id,-1");
  const [sortingvalue, setSortingValue] = useState(-1);
  const [sortingproperty, setSortingProperty] = useState("_id");
  const [nameEdited, setNameEdited] = useState(false);

  const PAGE_SIZE = itemsPerPage;

  let filteredListLastPage = filterednames.length / itemsPerPage;

  // ############ Section for passing state into components as functions #######

  function setItemsPerPageFunction(event) {
    setItemsPerPage(event);
  }

  function setPageFunction(event) {
    setPage(event);
  }

  function setSizeFunction(event) {
    setSize(event) && mutate();
  }

  function setSortingLogicFunction(event) {
    // setSortingLogicString(event);
    setSortingValue(event.split(",")[1]);
    setSortingProperty(event.split(",")[0]);
  }

  function setNameEditedFunction() {
    setNameEdited(!nameEdited);
  }

  // ########## End of section for passing state into components as functions ####

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    checked
      ? setTagFiltersState([...tagFilters, value])
      : setTagFiltersState(tagFilters.filter((tag) => tag != value));

    setPage(1);
  };

  // ########### SWR Section #################

  const getKey = (
    pageIndex,
    previousPageData,
    pagesize,
    sortingvalue,
    sortingproperty
  ) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end

    return `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/names/swr/swr?page=${
      pageIndex + 1
    }
    &limit=${pagesize}
    &sortingvalue=${sortingvalue}&sortingproperty=${sortingproperty}`; // SWR key, grab data from the next page (pageIndex+1) in each loop
  };

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite(
      (...args) => getKey(...args, PAGE_SIZE, sortingvalue, sortingproperty),
      fetcher
    );

  const names = data ? [].concat(...data) : [];

  let isAtEnd = data && data[data.length - 1]?.length < 1;

  useEffect(() => {
    if (names) {
      setFilteredNames([...names]);
    }
  }, [data]);
  //data was necessary to make it work with swr, using the names variable instead wouldn't trigger a state update

  //#################### END of SWR section ##############

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage, sortingvalue, sortingproperty]);

  useEffect(() => {
    let currenttags = tagFilters;

    //every time we click, lets start off with names aka its initial state. This way if we go backwards/unclick options, we'll regain the names we lost so future filtering is correct.
    // aka round: 1, we click christmas and male. So we lost all female names since they had no male tag
    //      round: 2, we unclick male

    setFilteredNames(
      names.filter((names) =>
        currenttags.every((selectedtag) =>
          names.tags.map(({ tag }) => tag).includes(selectedtag)
        )
      )
    );
  }, [tagFilters, data]);
  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed

  useEffect(() => {
    if (filterednames.length / page < itemsPerPage) {
      setSize(size + 1) && mutate();
    }
  }, [filterednames]);
  //makes sure there is at least 10 items(aka itemsPerPage value) per page or try to grab more names

  useEffect(() => {
    mutate();
  }, [nameEdited]);

  return (
    <div className="bg-violet-900">
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      {/* {`this is data ${JSON.stringify(data)}`}
      {`this is filtered names ${JSON.stringify(filterednames)}`}
      {`this is names ${JSON.stringify(names)}`} */}
      <section className="sm:px-4 bg-violet-900">
        <PageTitleWithImages
          title="Fetch"
          title2="Names"
        />
      </section>

      <div className="flex w-full sm:px-2">
        <FilteringSidebar
          category={category}
          handleFilterChange={handleFilterChange}
          IsOpen={IsOpen}
        />

        {/*################# CONTENT DIV ################### */}

        <div className="grow bg-darkPurple rounded-box place-items-center">
          {/* Button that toggles the filter div */}
          <GeneralButton
            text={`${IsOpen ? "Close Filters" : "Open Filters"}`}
            onClick={() => setIsOpen(!IsOpen)}
          />

          <Pagination
            page={page}
            itemsPerPage={itemsPerPage}
            filteredListLastPage={filteredListLastPage}
            isAtEnd={isAtEnd}
            setItemsPerPageFunction={setItemsPerPageFunction}
            setPageFunction={setPageFunction}
            setSizeFunction={setSizeFunction}
            size={size}
            filterednameslength={filterednames.length}
            setSortingLogicFunction={setSortingLogicFunction}
          />

          <section className="w-full">
            <HeadersForNames />
            {isLoading && (
              <div className="flex">
                <span className="text-white text-3xl my-20 mx-auto">
                  Fetching data ...
                </span>
              </div>
            )}

            <section className="whitespace-pre-line">
              {filterednames
                .slice(
                  page - 1 == 0 ? 0 : (page - 1) * itemsPerPage,
                  page * itemsPerPage
                )
                .map((name) => {
                  return (
                    <NameListingAsSections
                      name={name}
                      key={name._id}
                      sessionFromServer={sessionFromServer}
                      tagList={tagList}
                      setNameEditedFunction={setNameEditedFunction}
                    />
                  );
                })}

              <Pagination
                page={page}
                itemsPerPage={itemsPerPage}
                filteredListLastPage={filteredListLastPage}
                isAtEnd={isAtEnd}
                setItemsPerPageFunction={setItemsPerPageFunction}
                setPageFunction={setPageFunction}
                setSizeFunction={setSizeFunction}
                size={size}
                filterednameslength={filterednames.length}
                setSortingLogicFunction={setSortingLogicFunction}
              />

              <CheckForMoreData
                page={page}
                filteredListLastPage={filteredListLastPage}
                setSizeFunction={setSizeFunction}
                isAtEnd={isAtEnd}
              />
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
