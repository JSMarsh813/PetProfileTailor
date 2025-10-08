"use client";

import React, { useState, useEffect } from "react";
import GeneralOpenCloseButton from "../ReusableSmallComponents/buttons/generalOpenCloseButton";
import CoreListingPageLogic from "../CoreListingPagesLogic";
import ThanksContentListing from "./ThanksContentListing";
import { useNotifications } from "@/context/notificationsContext";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import { useSWRSimple } from "@/hooks/useSwrSimple";

export default function ToggleOneNotificationPage({
  contentList,
  swrForThisUserID,
  defaultOpen = "thanks",
  initialThankDocs,
}) {
  const [openContent, setOpenContent] = useState(defaultOpen);

  // wait to load name and desc docs until after the user clicks those notifications sections

  const {
    notifications,
    setNotifications,
    notificationsTotal,
    timeGrabbed,
    resetNotificationType,
  } = useNotifications();

  console.log("notifications in toggle", notifications);

  //############## SWR #################

  const thankSWR = useSWRSimple("thanks", {
    initialPage: initialThankDocs,
    revalidateFirstPage: false,
  });

  console.log("initialThankDocs", initialThankDocs);

  const nameSWR = useSWRSimple("names", {
    revalidateFirstPage: false,
    enabled: openContent === "names",
  });

  console.log("nameSwr", nameSWR);
  // The hook is mounted all the time, so size, mutate, cache, etc. are preserved.
  // SWR will remember previously loaded pages.
  // The first fetch is truly lazy: it only fires when enabled === true.
  // Switching tabs doesn’t reset anything because the hook never unmounted.

  // const descSWR =
  //   openContent === "descriptions"
  //     ? useSWRSimple("descriptions", { revalidateFirstPage: false })
  //     : null;

  // Extract notifications if SWR exists
  const thankDocs = thankSWR?.SWRNotifications || [];
  const nameDocs = nameSWR?.SWRNotifications || [];

  console.log("nameDocs", nameDocs);
  // const descDocs = descSWR?.SWRNotifications || [];

  // swr properties:
  // SWRNotifications,
  // error,
  // isLoading,
  // SWRisReachingEnd,
  // size,
  // setSize,
  // mutate,

  const loadMore = () => {
    if (!SWRisReachingEnd) setSize((s) => s + 1);
  };

  function handleContentClick(contentKey) {
    setOpenContent(openContent === contentKey ? null : contentKey);

    // if its descriptions,
    // is notification # not 0
    // load the api to grab descriptions
    // if its names, load the api to grab names
    // is notification # not 0
    // load the api to grab descriptions
  }

  function notificationCount(content) {
    const lookup = {
      thanks: notifications.thanks,
      names: notifications.names,
      descriptions: notifications.descriptions,
    };
    return lookup[content.type] ?? 0;
  }

  function setNotificationCountToZero() {
    if (openContent === "names") {
      if (notifications.names !== 0) {
        resetNotificationType("names");
      }
    } else if (openContent === "descriptions") {
      {
        if (notifications.descriptions !== 0) {
          resetNotificationType("descriptions");
        }
      }
    } else {
      if (notifications.thanks !== 0) {
        resetNotificationType("thanks");
      }
    }
  }

  // helper function to pause
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    let cancelled = false;

    const resetNotification = async () => {
      await sleep(2000); // wait 2 seconds
      if (!cancelled) {
        setNotificationCountToZero();
      }
    };

    resetNotification();

    // cleanup in case openContent changes before timeout, this way if the user jumps to another notification field the notifications they didn't read don't get set to 0
    return () => {
      cancelled = true;
    };
  }, [openContent]);

  const noNotificationsMessage = (
    // this is a JSX literal not a JSX component
    // so we render it directly, rather than calling it like a JSX component/function
    <div
      className={`rounded-2xl px-4 mt-2 p-4 text-subtleWhite ml-5 my-2   hover:bg-secondary/60 `}
    >
      <p className="my-1">Woah, it&apos;s so empty! 😿</p>
      <p className="my-1">
        These pets will use this as a cozy nap spot until you get a notification
        🐈🐕.
      </p>
    </div>
  );
  return (
    <section className="w-full  max-w-[800px]">
      <section className="flex flex-col items-center gap-2">
        {" "}
        <p className="text-center">
          {" "}
          Notifications can be manually rechecked every 5 minutes.
        </p>
        <p>Why? To reduce the server load to keep the app free.</p>
      </section>
      <div className="flex justify-around">
        {contentList.map((category) => (
          <GeneralOpenCloseButton
            key={category.value}
            text={category.text}
            setState={handleContentClick}
            className={category.className}
            value={category.value}
            state={openContent}
            sideText={notificationCount(category)}
          />
        ))}
      </div>
      {openContent === "thanks" && (
        <section className="whitespace-pre-line ">
          <div className="flex justify-center">
            <GeneralButton
              type="button"
              text="recheck"
              subtle
            />
          </div>
          {thankDocs?.length > 0 &&
            thankDocs.map((singleContent) => {
              return (
                <ThanksContentListing
                  singleContent={singleContent}
                  key={singleContent._id}
                />
              );
            })}
          {thankDocs?.length === 0 && noNotificationsMessage}
        </section>
      )}

      {openContent === "names" && (
        <section className="whitespace-pre-line ">
          <div className="flex justify-center">
            {/* needs to go inside content listing */}
            <GeneralButton
              type="button"
              text="recheck"
              subtle
            />
          </div>
          {Array.isArray(nameDocs) &&
            nameDocs?.length > 0 &&
            nameDocs.map((singleContent) => {
              return (
                <ThanksContentListing
                  singleContent={singleContent}
                  key={singleContent._id}
                />
              );
            })}
          {nameDocs?.length === 0 && noNotificationsMessage}
        </section>
      )}
      {openContent === "descriptions" && noNotificationsMessage}
    </section>
  );
}
