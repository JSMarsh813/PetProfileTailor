import React, { useEffect, useState } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import DescriptionListingAsSections from "../components/ShowingListOfContent/DescriptionListingAsSections";
import removeDeletedContent from "../components/DeletingData/removeDeletedContent";
import dbConnect from "../utils/db";
import Category from "../models/descriptioncategory";
import DescriptionTag from "../models/descriptiontag";

import Pagination from "../components/ShowingListOfContent/pagination";

import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/fetch";
import CheckForMoreData from "../components/ReusableSmallComponents/buttons/CheckForMoreDataButton";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  await dbConnect.connect();

  let data = await Category.find().populate("tags");

  let tagData = await DescriptionTag.find();
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

function FetchDescriptions({ sessionFromServer, category, tagList }) {
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

  const [IsOpen, SetIsOpen] = useState(false);
  const [tagFilters, setTagFiltersState] = useState([]);
  const [filteredDescriptions, setFilteredDescriptions] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortingvalue, setSortingValue] = useState(-1);
  const [sortingproperty, setSortingProperty] = useState("likedbylength");
  const [itemEdited, setItemEdited] = useState(false);
  const [deleteThisContentId, setDeleteThisContentId] = useState(null);

  const PAGE_SIZE = itemsPerPage;
  let filteredListLastPage = filteredDescriptions.length / itemsPerPage;

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
    setSortingValue(event.split(",")[1]);
    setSortingProperty(event.split(",")[0]);
  }

  function setItemEditedFunction() {
    setItemEdited(!itemEdited);
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
  const getKey = (pageIndex, previousPageData, pagesize) => {
    if (previousPageData && !previousPageData.length) return null;

    return `${
      process.env.NEXT_PUBLIC_BASE_FETCH_URL
    }api/description/swr/swr?page=${
      pageIndex + 1
    }&limit=${pagesize}&sortingvalue=${sortingvalue}&sortingproperty=${sortingproperty}`; // SWR key, grab data from the next page (pageIndex+1) in each loop
  };

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite(
      (...args) => getKey(...args, PAGE_SIZE, sortingvalue, sortingproperty),
      fetcher,
    );

  const descriptions = data ? [].concat(...data) : [];

  let isAtEnd = data && data[data.length - 1]?.length < 1;

  useEffect(() => {
    if (descriptions) {
      setFilteredDescriptions([...descriptions]);
    }
  }, [data]);
  //data was necessary to make it work with swr, using the names descriptions instead wouldn't trigger a state update

  //#################### END of main swr section ################

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let currenttags = tagFilters;

    setFilteredDescriptions(
      descriptions.filter((description) =>
        currenttags.every((selectedtag) =>
          description.tags.map(({ tag }) => tag).includes(selectedtag),
        ),
      ),
    );
  }, [tagFilters, data]);

  //########### Section that allows the deleted content to be removed without having to refresh the page, react notices that a key has been removed from the content list and unmounts that content ###########

  useEffect(() => {
    if (deleteThisContentId !== null) {
      removeDeletedContent(
        setFilteredDescriptions,
        filteredDescriptions,
        deleteThisContentId,
        setDeleteThisContentId,
      );
    }
  }, [deleteThisContentId]);

  // ########### End of Section that allows the deleted content to be removed without having to refresh the page ####

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage, sortingvalue, sortingproperty]);

  useEffect(() => {
    if (filteredDescriptions.length / page < itemsPerPage) {
      setSize(size + 1) && mutate();
    }
  }, [filteredDescriptions]);

  useEffect(() => {
    mutate();
  }, [itemEdited]);

  return (
    <div className="bg-violet-900">
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <section className="sm:px-4 bg-violet-900 w-screen">
        <PageTitleWithImages
          imgSrc="bg-[url('https://images.pexels.com/photos/1599452/pexels-photo-1599452.jpeg?auto=compress&cs=tinysrgb&w=400')]"
          title="Fetch "
          title2="Descriptions"
        />
      </section>
      <div className="flex max-w-screen">
        <FilteringSidebar
          className="min-w-24"
          category={category}
          handleFilterChange={handleFilterChange}
          IsOpen={IsOpen}
        />

        {/*################# CONTENT DIV ################### */}

        <div className="bg-secondary rounded-box w-full">
          {/* w-full ensures the list of content takes up the remaining space, it does not lead to overflow because it is flexed with filteringSidebar*/}
          <GeneralButton
            text={`${IsOpen ? "Close Filters" : "Open Filters"}`}
            onClick={() => SetIsOpen(!IsOpen)}
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
            filterednameslength={filteredDescriptions.length}
            setSortingLogicFunction={setSortingLogicFunction}
          />

          <section>
            <section className="">
              {isLoading && (
                <div className="flex w-full items-center justify-center">
                  {/* w-full makes it as wide as its parent, but you still need items-center justify-center to center the text horizonally and vetically */}
                  <span className="text-white text-3xl my-20 mx-auto">
                    Fetching data ...
                  </span>
                </div>
              )}

              {filteredDescriptions
                .slice(
                  page - 1 == 0 ? 0 : (page - 1) * itemsPerPage,
                  page * itemsPerPage,
                )
                .map((description) => {
                  return (
                    <DescriptionListingAsSections
                      description={description}
                      key={description._id}
                      signedInUsersId={signedInUsersId}
                      tagList={tagList}
                      setItemEditedFunction={setItemEditedFunction}
                      setDeleteThisContentId={setDeleteThisContentId}
                    />
                  );
                })}
            </section>
          </section>

          <Pagination
            page={page}
            itemsPerPage={itemsPerPage}
            filteredListLastPage={filteredListLastPage}
            isAtEnd={isAtEnd}
            setItemsPerPageFunction={setItemsPerPageFunction}
            setPageFunction={setPageFunction}
            setSizeFunction={setSizeFunction}
            size={size}
            filterednameslength={filteredDescriptions.length}
            setSortingLogicFunction={setSortingLogicFunction}
          />

          <CheckForMoreData
            page={page}
            filteredListLastPage={filteredListLastPage}
            setSizeFunction={setSizeFunction}
            isAtEnd={isAtEnd}
          />
        </div>
      </div>
    </div>
  );
}

export default FetchDescriptions;
