"use client";

import React, { useEffect, useState, useRef } from "react";

import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import ContentListing from "@/components/ShowingListOfContent/ContentListing";
import Pagination from "@components/ShowingListOfContent/pagination";
import { useSwrPagination } from "@hooks/useSwrPagination";
import startCooldown from "@utils/startCooldown";
import GoToTopButton from "@components/ReusableSmallComponents/buttons/GoToTopButton";

import { useSession } from "next-auth/react";

export default function ProfilePagesLogic({ dataType, profileUserId }) {
  const { data: session } = useSession();
  const [remainingSortCooldown, setRemainingSortCooldown] = useState(0);
  const sortIntervalRef = useRef(null);

  // prevents overlapping cooldown intervals by attaching the interval to useRef, it will clear after 5 seconds
  // so we check if filterCooldownRef.current has no intervals currently going before running another interval

  let userName = "";
  let profileImage = "";
  let signedInUsersId = "";

  if (session?.user) {
    userName = session.user.name;
    profileImage = session.user.profileimage;
    signedInUsersId = session.user.id;
  }

  // store liked IDs in a ref so updates don't trigger full re-render

  const [itemsPerUiPage, setItemsPerUiPage] = useState(5);

  const [currentUiPage, setCurrentUiPage] = useState(1);

  const [sortingValue, setSortingValue] = useState(-1);
  const [sortingProperty, setSortingProperty] = useState("_id");

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
    sortingProperty: sortingProperty,
    sortingValue: sortingValue,
    profileUserId,
  });

  console.log("SWR", Array.isArray(data)); // true
  console.log("SWR", data.length);
  console.log("SWR", typeof data[0]); // "object"
  console.log("SWR first item", data[0] ? data[0]._id : "null"); // check first object's id
  console.log("porifleUsersId in profile Pages", profileUserId);

  const content = data ?? [];

  // ############ Section for passing state into components as functions #######

  function setItemsPerPageFunction(event) {
    setItemsPerUiPage(event);
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

  // if users have changed how the items get sorted, then start over swr from page 1
  useEffect(() => {
    setSize(1);
  }, [sortingValue, sortingProperty]);

  return (
    <div className="flex  sm:px-2  mx-auto ">
      {/*################# CONTENT DIV ################### */}

      <div className="grow bg-primary rounded-box place-items-center  ">
        <Pagination
          itemsPerPage={itemsPerUiPage}
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
                    : (currentUiPage - 1) * itemsPerUiPage,
                  currentUiPage * itemsPerUiPage,
                )
                .map((singleContent) => {
                  return (
                    <ContentListing
                      dataType={dataType}
                      singleContent={singleContent}
                      key={singleContent._id}
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
        <GoToTopButton top="280" />
      </div>
    </div>
  );
}
