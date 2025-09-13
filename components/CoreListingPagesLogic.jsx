import React, { useEffect, useState, useRef } from "react";
import Layout from "@components/NavBar/NavLayoutwithSettingsMenu";
import { Drawer } from "@mui/material";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import FilteringSidebar from "@components/Filtering/FilteringSidebar";
import PageTitleWithImages from "@components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import NameListingAsSections from "@components/ShowingListOfContent/NameListingAsSections";
import removeDeletedContent from "@components/DeletingData/removeDeletedContent";
import Pagination from "@components/ShowingListOfContent/pagination";
import CheckForMoreData from "@components/ReusableSmallComponents/buttons/CheckForMoreDataButton";
import { useSwrPagination } from "@hooks/useSwrPagination";
import startCooldown from "@utils/startCooldown";
import GoToTopButton from "@components/ReusableSmallComponents/buttons/GoToTopButton";
import { ReportsProvider } from "@context/ReportsContext";

export default function CoreListingPageLogic({
  dataType,
  categoriesWithTags,
  sessionFromServer,
  usersLikedNamesFromDb,
  contentUserReported,
}) {
  const [remainingFilterCooldown, setRemainingFilterCooldown] = useState(0);
  const [remainingSortCooldown, setRemainingSortCooldown] = useState(0);
  const filterCooldownRef = useRef(null);
  const sortIntervalRef = useRef(null);
  // prevents overlapping cooldown intervals by attaching the interval to useRef, it will clear after 5 seconds
  // so we check if filterCooldownRef.current has no intervals currently going before running another interval

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

  console.log("contentUserReported", contentUserReported);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [IsOpen, setIsOpen] = useState(false);
  const [filterTagsIds, setFilterTagsIds] = useState([]);

  const [currentUiPage, setCurrentUiPage] = useState(1);
  const [itemsPerUiPage, setItemsPerUiPage] = useState(10);

  const [sortingValue, setSortingValue] = useState(-1);
  const [sortingProperty, setSortingProperty] = useState("_id");
  const [triggerApplyFilters, setTriggerApplyFilters] = useState([]);

  const toggleDrawer = (newOpen) => {
    setIsOpen(newOpen);
  };

  // ########### SWR Section #################

  const {
    data,
    totalPagesInDatabase,
    totalItems,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate,
  } = useSwrPagination({
    dataType,
    currentUiPage,
    itemsPerUiPage,
    tags: triggerApplyFilters,
    sortingProperty: sortingProperty,
    sortingValue: sortingValue,
  });

  // ############ Section for passing state into components as functions #######

  function setItemsPerPageFunction(event) {
    setItemsPerPage(event);
  }

  function setPageFunction(event) {
    setSize(event);
  }

  function setSortingLogicFunction(event) {
    // setSortingLogicString(event);
    setSortingValue(event.split(",")[1]);
    setSortingProperty(event.split(",")[0]);
    startCooldown(sortIntervalRef, setRemainingSortCooldown, 3);
  }

  // ########## End of section for passing state into components as functions ####

  const handleFilterChange = (e) => {
    // console.log("handleFilterChange", e.target);
    // console.log("handleFilterChange filterTagsIds", filterTagsIds);
    const { value, checked } = e.target;

    checked
      ? setFilterTagsIds([...filterTagsIds, value])
      : setFilterTagsIds(filterTagsIds.filter((tag) => tag != value));
  };

  const handleApplyFilters = (reset) => {
    if (reset) {
      setFilterTagsIds([]);
    } else {
      startCooldown(filterCooldownRef, setRemainingFilterCooldown);
      setTriggerApplyFilters(filterTagsIds);
      toggleDrawer(false);
    }
    setCurrentUiPage(1);
    setSize(1);
  };

  const content = data ?? [];
  // console.log("content", content);

  //#################### END of SWR section ##############

  // if users have changed how the items get sorted, then start over swr from page 1
  useEffect(() => {
    setSize(1);
  }, [sortingValue, sortingProperty]);

  //########### Section that allows the deleted content to be removed without having to refresh the page, react notices that a key has been removed from the content list and unmounts that content ###########

  return (
    <ReportsProvider initialReports={contentUserReported}>
      <div>
        <Layout
          profileImage={profileImage}
          userName={userName}
          sessionFromServer={sessionFromServer}
        />
        <section className="sm:px-4  mx-auto">
          <PageTitleWithImages
            title="Fetch"
            title2={
              (dataType === "name" && "Names") ||
              (dataType == "description" && "Descriptions")
            }
          />
        </section>

        <div className="flex  sm:px-2 max-w-7xl mx-auto ">
          <Drawer
            open={IsOpen}
            onClose={(event, reason) => {
              if (reason === "backdropClick") {
                // prevent closing when clicking on backdrop
                return;
              }
              toggleDrawer(false);
            }}
            anchor="left"
          >
            <FilteringSidebar
              category={categoriesWithTags}
              handleFilterChange={handleFilterChange}
              handleApplyFilters={handleApplyFilters}
              filterTagsIds={filterTagsIds}
              toggleDrawer={toggleDrawer}
              isLoading={isLoading}
              remainingFilterCooldown={remainingFilterCooldown}
              filterCooldownRef={filterCooldownRef}
              startCooldown={startCooldown}
            />
          </Drawer>
          {/*################# CONTENT DIV ################### */}

          <div className="grow bg-primary rounded-box place-items-center  ">
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
              totalItems={totalItems}
              amountOfDataLoaded={data?.length}
              remainingSortCooldown={remainingSortCooldown}
              sortingValue={sortingValue}
              sortingProperty={sortingProperty}
            />

            <section className="w-full">
              {isLoading && (
                <div className="flex">
                  <span className="text-white text-3xl my-20 mx-auto">
                    Fetching data ...
                  </span>
                </div>
              )}

              <section className="whitespace-pre-line ">
                {content?.length > 0 &&
                  content
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
                          likedSetRef={likedSetRef}
                          recentLikesRef={recentLikesRef}
                          categoriesWithTags={categoriesWithTags}
                          mutate={mutate}
                        />
                      );
                    })}

                {/* <CheckForMoreData
                filteredListLastPage={filteredListLastPage} //deleted
                setSize={setSize}
              /> */}
              </section>
            </section>
            <GoToTopButton top="280" />
          </div>
        </div>
      </div>
    </ReportsProvider>
  );
}
