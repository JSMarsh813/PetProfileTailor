"use client";

import React, { useEffect, useState, useRef } from "react";
import { Drawer } from "@mui/material";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import FilteringSidebar from "@components/Filtering/FilteringSidebar";
import PageTitleWithImages from "@components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import ContentListing from "@/components/ShowingListOfContent/ContentListing";
import Pagination from "@components/ShowingListOfContent/pagination";
import CheckForMoreData from "@components/ReusableSmallComponents/buttons/CheckForMoreDataButton";
import { useSwrPagination } from "@hooks/useSwrPagination";
import startCooldown from "@utils/startCooldown";

import { useSession } from "next-auth/react";

export default function CoreListingPageLogic({
  dataType,
  swrForThisUserID = "",
  showHeader = true,
  restrictSwrToLikedNames = false,
}) {
  // console.log("restrictSwrToLikedNames", restrictSwrToLikedNames);
  const { data: session } = useSession();
  const [remainingFilterCooldown, setRemainingFilterCooldown] = useState(0);
  const [remainingSortCooldown, setRemainingSortCooldown] = useState(0);
  const filterCooldownRef = useRef(null);
  const sortIntervalRef = useRef(null);
  let profileUserId = swrForThisUserID;

  // prevents overlapping cooldown intervals by attaching the interval to useRef, it will clear after 5 seconds
  // so we check if filterCooldownRef.current has no intervals currently going before running another interval

  let userName = "";
  let profileImage = "";
  let signedInUsersId = "";

  if (session?.user) {
    userName = session.user.name;
    profileImage = session.user.profileImage;
    signedInUsersId = session.user.id;
  }

  // store liked IDs in a ref so updates don't trigger full re-render

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
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
    profileUserId,
    restrictSwrToLikedNames,
  });

  // console.log("SWR", Array.isArray(data)); // true
  // console.log("SWR", data.length);
  // console.log("SWR", typeof data[0]); // "object"
  // console.log("SWR first item", data[0] ? data[0]._id : "null"); // check first object's id

  let content = data ?? [];

  // console.log("content check", content);

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

  //#################### END of SWR section ##############

  // if users have changed how the items get sorted, then start over swr from page 1
  useEffect(() => {
    setSize(1);
  }, [sortingValue, sortingProperty]);

  //########### Section that allows the deleted content to be removed without having to refresh the page, react notices that a key has been removed from the content list and unmounts that content ###########

  return (
    <div>
      {showHeader && (
        <section className="sm:px-4  mx-auto">
          <PageTitleWithImages
            title="Fetch"
            title2={
              (dataType === "names" && "Names") ||
              (dataType == "descriptions" && "Descriptions")
            }
          />
        </section>
      )}

      <div className="flex  sm:px-2  mx-auto ">
        <Drawer
          open={isOpen}
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
            dataType={dataType}
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
            text={`${isOpen ? "Close Filters" : "Open Filters"}`}
            onClick={() => setIsOpen(!isOpen)}
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
                  .map((singleContent) => {
                    return (
                      <ContentListing
                        dataType={dataType}
                        singleContent={singleContent}
                        key={singleContent._id}
                        // VITAL for the ui to see the mutation changes, if the key hasn't changed, then react will ignore the updates
                        signedInUsersId={signedInUsersId}
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
        </div>
      </div>
    </div>
  );
}
