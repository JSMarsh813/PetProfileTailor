import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import NameListingAsSections from "../components/ShowingListOfContent/NameListingAsSections";
import removeDeletedContent from "../components/DeletingData/removeDeletedContent";
import dbConnect from "../utils/db";
import Category from "../models/nameCategory";
import NameTag from "../models/NameTag";
import NameLikes from "../models/NameLikes";

import Pagination from "../components/ShowingListOfContent/pagination";
import CheckForMoreData from "../components/ReusableSmallComponents/buttons/CheckForMoreDataButton";
import { useSwrPagination } from "../hooks/useSwrPagination";

//getkey: accepts the index of the current page, as well as the data from the previous page.

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  await dbConnect.connect();

  //grabbing category's

  const data = await Category.find().populate("tags");

  //grabbing Tags for name edit function

  const tagData = await NameTag.find();
  let tagListProp = tagData
    .map((tag) => tag)
    .reduce((sum, value) => sum.concat(value), []);

  // grabbing names by logged in user
  let usersLikedNamesFromDb = [];

  if (session) {
    await dbConnect.connect();
    const userId = session.user.id;
    const likes = await NameLikes.find({ userId }).select("nameId -_id");
    usersLikedNamesFromDb = likes.map((l) => l.nameId.toString());
  }

  // MongoDB documents (from Mongoose) are not plain JavaScript objects they have extra methods like .save, ect, but Next.JS needs JSON-serializable objects
  // thus the JSON.parse(JSON.stringify)
  return {
    props: {
      category: JSON.parse(JSON.stringify(data)),
      tagList: JSON.parse(JSON.stringify(tagListProp)),
      sessionFromServer: session,
      usersLikedNamesFromDb,
    },
  };
};

export default function FetchNames({
  category,
  sessionFromServer,
  tagList,
  usersLikedNamesFromDb,
}) {
  // #### Info for nav menu

  let userName = "";
  let profileImage = "";
  let signedInUsersId = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
    signedInUsersId = sessionFromServer.user.id;
  }
  // ##### end of section for nav menu
  // store liked IDs in a ref so updates don't trigger full re-render
  const likedSetRef = useRef(new Set(usersLikedNamesFromDb));
  const recentLikesRef = useRef({}); // { [nameId]: 1 | 0 | -1 }
  // tracks if the likes count has to be updated, important for if the user navigates backwards

  // local state to trigger re-render of a single card when the likes toggled
  const [likesToggledNameId, setLikesToggledNameId] = useState(null);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [IsOpen, setIsOpen] = useState(false);
  const [filterTagsIds, setFilterTagsIds] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [swrPage, setSwrPage] = useState(1);
  const [currentUiPage, setCurrentUiPage] = useState(1);
  const [itemsPerUiPage, setItemsPerUiPage] = useState(10);
  // const [sortinglogicstring, setSortingLogicString] = useState("_id,-1");
  const [sortingvalue, setSortingValue] = useState(-1);
  const [sortingproperty, setSortingProperty] = useState("_id");
  const [nameEdited, setNameEdited] = useState(false);
  const [deleteThisContentId, setDeleteThisContentId] = useState(null);

  let filteredListLastPage = filteredNames.length / itemsPerPage;

  // ############ Section for passing state into components as functions #######

  function setItemsPerPageFunction(event) {
    setItemsPerPage(event);
  }

  function setPageFunction(event) {
    setSwrPage(event);
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
      ? setFilterTagsIds([...filterTagsIds, value])
      : setFilterTagsIds(filterTagsIds.filter((tag) => tag != value));

    setSwrPage(1);
  };

  // ########### SWR Section #################

  const {
    data,
    totalPagesInDatabase,
    totalItems,
    size,
    setSize,
    isLoading,
    currentSwrPage,
    isValidating,
    mutate,
  } = useSwrPagination({
    currentUiPage,
    itemsPerUiPage,
    tags: filterTagsIds,
    sortingproperty: "createdAt",
    sortingvalue: -1,
  });

  const names = data ?? [];
  console.log("names", names);

  //#################### END of SWR section ##############

  // if users have changed how the items get sorted, then start over swr from page 1
  useEffect(() => {
    setSwrPage(1);
  }, [sortingvalue, sortingproperty]);

  useEffect(() => {
    if (nameEdited) {
      mutate();
    }
  }, [nameEdited]);

  //########### Section that allows the deleted content to be removed without having to refresh the page, react notices that a key has been removed from the content list and unmounts that content ###########

  useEffect(() => {
    if (deleteThisContentId !== null) {
      removeDeletedContent(
        setFilteredNames,
        filteredNames,
        deleteThisContentId,
        setDeleteThisContentId,
      );
    }
  }, [deleteThisContentId]);

  // ########### End of Section that allows the deleted content to be removed without having to refresh the page ####

  return (
    <div className="bg-violet-900">
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

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
            itemsPerPage={itemsPerPage}
            setItemsPerPageFunction={setItemsPerPageFunction}
            setPageFunction={setPageFunction}
            setSize={setSize}
            size={size}
            currentUiPage={currentUiPage}
            setCurrentUiPage={setCurrentUiPage}
            setSortingLogicFunction={setSortingLogicFunction}
            totalPagesInDatabase={totalPagesInDatabase}
            currentSwrPage={currentSwrPage}
            totalItems={totalItems}
            amountOfDataLoaded={data?.length}
          />

          <section className="w-full">
            {isLoading && (
              <div className="flex">
                <span className="text-white text-3xl my-20 mx-auto">
                  Fetching data ...
                </span>
              </div>
            )}

            <section className="whitespace-pre-line">
              {names
                .slice(
                  currentUiPage - 1 == 0
                    ? 0
                    : (currentUiPage - 1) * itemsPerPage,
                  currentUiPage * itemsPerPage,
                )
                .map((name) => {
                  return (
                    <NameListingAsSections
                      name={name}
                      key={name._id}
                      signedInUsersId={signedInUsersId}
                      tagList={tagList}
                      setNameEditedFunction={setNameEditedFunction}
                      setDeleteThisContentId={setDeleteThisContentId}
                      likedSetRef={likedSetRef}
                      recentLikesRef={recentLikesRef}
                      likesToggledNameId={likesToggledNameId}
                    />
                  );
                })}

              <Pagination
                itemsPerPage={itemsPerPage}
                setItemsPerPageFunction={setItemsPerPageFunction}
                setPageFunction={setPageFunction}
                setSize={setSize}
                size={size}
                setSortingLogicFunction={setSortingLogicFunction}
                totalItems={totalItems}
              />

              <CheckForMoreData
                filteredListLastPage={filteredListLastPage}
                setSize={setSize}
              />
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
