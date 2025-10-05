"use client";

import React, { useState } from "react";
import GeneralOpenCloseButton from "../ReusableSmallComponents/buttons/generalOpenCloseButton";
import CoreListingPageLogic from "../CoreListingPagesLogic";
import ThanksContentListing from "./ThanksContentListing";

export default function ToggleOneNotificationPage({
  contentList,
  swrForThisUserID,
  defaultOpen = "Thanks",
  thankDocs,
}) {
  const [openContent, setOpenContent] = useState(defaultOpen);

  function handleContentClick(contentKey) {
    setOpenContent(openContent === contentKey ? null : contentKey);
  }

  const noNotificationsMessage = (
    // this is a JSX literal not a JSX component
    // so we render it directly, rather than calling it like a JSX component/function
    <div
      className={`rounded-2xl px-4 mt-2 p-4 text-subtleWhite ml-5 my-2   hover:bg-secondary/60 `}
    >
      <p className="my-1">Woah, it's so empty! 😿</p>
      <p className="my-1">
        These pets will use this as a cozy nap spot until you get a notification
        🐈🐕.
      </p>
    </div>
  );
  return (
    <section className="w-full  max-w-[800px]">
      <div className="flex justify-around">
        {contentList.map((category) => (
          <GeneralOpenCloseButton
            key={category.value}
            text={category.text}
            setState={handleContentClick}
            className={category.className}
            value={category.value}
            state={openContent}
          />
        ))}
      </div>

      {openContent === "Thanks" && (
        <section className="whitespace-pre-line ">
          {thankDocs?.length > 0 &&
            thankDocs
              // .slice(
              //   currentUiPage - 1 == 0
              //     ? 0
              //     : (currentUiPage - 1) * itemsPerPage,
              //   currentUiPage * itemsPerPage,
              // )
              .map((singleContent) => {
                return (
                  <ThanksContentListing
                    singleContent={singleContent}
                    key={singleContent._id}
                  />
                );
              })}
          {thankDocs.length === 0 && noNotificationsMessage}

          {/* <CheckForMoreData
                      filteredListLastPage={filteredListLastPage} //deleted
                      setSize={setSize}
                    /> */}
        </section>
      )}

      {openContent === "Name Likes" && noNotificationsMessage}

      {openContent === "Description Likes" && noNotificationsMessage}

      {/* {openContent === "Added Descriptions" && (
        <CoreListingPageLogic
          dataType="descriptions"
          swrForThisUserID={swrForThisUserID}
          showHeader={false}
          restrictSwrToLikedNames={false}
        />
      )} */}
    </section>
  );
}
