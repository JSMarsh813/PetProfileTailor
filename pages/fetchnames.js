import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import HeadersForNames from "../components/ShowingListOfContent/HeadersForNames";
import NameListingAsSections from "../components/ShowingListOfContent/NameListingAsSections";

import dbConnect from "../config/connectmongodb";
import Category from "../models/nameCategory";
import NameTag from "../models/NameTag";
import Names from "../models/Names";

import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/fetch";
import useOnScreen from "../hooks/useOnScreen";

const PAGE_SIZE = 10;

//getkey: accepts the index of the current page, as well as the data from the previous page.

const getKey = (pageIndex, previousPageData, pagesize) => {
  if (previousPageData && !previousPageData.length) return null; // reached the end

  return `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/names/swr/swr?page=${
    pageIndex + 1
  }&limit=${pagesize}`; // SWR key, grab data from the next page (pageIndex+1) in each loop
};

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  dbConnect();

  //grabbing category's

  const data = await Category.find().populate("tags");

  //grabbing names
  const nameData = await Names.find()
    .populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    })
    .populate({ path: "tags", select: ["tag"] });

  //grabbing Tags for name edit function

  const tagData = await NameTag.find();
  let tagListProp = tagData
    .map((tag) => tag)
    .reduce((sum, value) => sum.concat(value), []);

  return {
    props: {
      category: JSON.parse(JSON.stringify(data)),
      nameList: JSON.parse(JSON.stringify(nameData)),
      sessionFromServer: session,
      tagList: JSON.parse(JSON.stringify(tagListProp)),
    },
  };
};

export default function FetchNames({
  category,
  nameList,
  sessionFromServer,
  tagList,
}) {
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  const ref = useRef();
  const isVisible = useOnScreen(ref);
  //true, then false. But all 30 names are loaded even when it says isVisible is false? Turns to true when scrolled down as expected...but its strange all 30 names load even when the div is not visible?

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite((...args) => getKey(...args, PAGE_SIZE), fetcher);

  const names = data ? [].concat(...data) : [];
  // 0 names, then 20 names, then 30 names
  const isLoadingInitialData = !data && !error;
  // true then false
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  //always is true
  const isEmpty = data?.[0]?.length === 0;
  //always is false
  const isAtEnd = data && data[data.length - 1]?.length < 1;
  //always is false
  const isRefreshing = isValidating && data && data.length === size;
  //always is false

  // mutate();

  console.log(`isVisible ${names.length}`);

  //  ################ sets up the toggle for the filter div #############################
  const [IsOpen, SetIsOpen] = useState(true);

  const [tagFilters, setTagFiltersState] = useState([]);

  const [filterednames, setFilteredNames] = useState([]);

  useEffect(() => {
    if (names) {
      setFilteredNames([...names]);
    }
  }, [data]);
  //data was necessary to make it work with swr, using the names variable instead wouldn't trigger a state update

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    checked
      ? setTagFiltersState([...tagFilters, value])
      : setTagFiltersState(tagFilters.filter((tag) => tag != value));
  };

  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed

  useEffect(() => {
    let currenttags = tagFilters;

    //every time we click, lets start off with nameList aka its initial state. This way if we go backwards/unclick options, we'll regain the names we lost so future filtering is correct.
    // aka round: 1, we click christmas and male. So we lost all female names since they had no male tag
    //      round: 2, we unclick male

    setFilteredNames(
      names.filter((names) =>
        currenttags.every((selectedtag) =>
          names.tags.map(({ tag }) => tag).includes(selectedtag)
        )
      )
    );
  }, [tagFilters, data, isRefreshing, isValidating]);

  return (
    <div className="bg-violet-900">
      <Layout
        profileImage={profileImage}
        userName={userName}
      />

      <section className="px-4 bg-violet-900">
        <PageTitleWithImages
          title="Fetch"
          title2="Names"
        />

        <div className="flex w-full">
          {/* ###################### FILTER DIV ############################ */}

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
              onClick={() => SetIsOpen(!IsOpen)}
            />

            <section className="border-2 border-amber-300 w-full">
              <HeadersForNames />

              <section className="whitespace-pre-line">
                {filterednames.map((name) => {
                  return (
                    <NameListingAsSections
                      name={name}
                      key={name._id}
                      sessionFromServer={sessionFromServer}
                      tagList={tagList}
                    />
                  );
                })}
                {/* {!isRefreshing && isReachingEnd ? (
                  "no more names available"
                ) : ( */}
                <div className="text-center my-4">
                  <GeneralButton
                    text="Check for more names"
                    className=""
                    onClick={() => setSize(size + 1) && mutate()}
                  />
                  {isAtEnd && (
                    <p>
                      You have reached the end of the list! However you can
                      click "check more names" again to check for just-added
                      names.
                    </p>
                  )}
                </div>
              </section>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
