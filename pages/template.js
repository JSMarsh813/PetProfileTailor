import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/fetch";
import useOnScreen from "../hooks/useOnScreen";

const PAGE_SIZE = 5;

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

  return {
    props: {
      sessionFromServer: session,
    },
  };
};

export default function NavLayoutwithSettingsMenu({ sessionFromServer }) {
  //for Nav menu profile name and image
  //let section exists in case the user is not signed in

  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

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
  const isReachingEnd = data && data[data.length - 1]?.length < PAGE_SIZE;
  //always is false
  const isRefreshing = isValidating && data && data.length === size;
  //always is false

  console.log(`isVisible ${names.length}`);

  useEffect(() => {
    if (isVisible && !isReachingEnd && !isRefreshing) {
      setSize(size + 1);
      //as we reach the bottom aka the "ref" div, grab more data
    }
  }, [isVisible, isRefreshing]);

  return (
    <Layout
      profileImage={profileImage}
      userName={userName}
    >
      {isEmpty ? <p>no names found.</p> : null}

      {names.map((name) => {
        return (
          <p
            key={name._id}
            style={{ margin: "20px 0", height: 20 }}
          >
            - {name.name}
          </p>
        );
      })}

      {JSON.stringify(isVisible)}

      {/* <button onClick={() => setSize(size + 1)}>Load More</button> */}
      {/* {console.log(JSON.stringify(names))} */}
      <div ref={ref}>
        {isLoadingMore ? "loading..." : isReachingEnd ? "no more names" : ""}
      </div>
    </Layout>
  );
}
