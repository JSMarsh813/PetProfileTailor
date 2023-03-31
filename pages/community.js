import React, { useEffect, useState } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import BatsignalPost from "../components/ShowingListOfContent/batsignalPost";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import AddPost from "../components/AddingNewData/AddPost";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import Image from "next/image";

import dbConnect from "../config/connectmongodb";
import Pagination from "../components/ShowingListOfContent/pagination";

import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/fetch";
import CheckForMoreData from "../components/ReusableSmallComponents/buttons/CheckForMoreDataButton";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  dbConnect();

  return {
    props: {
      sessionFromServer: session,
    },
  };
};

export default function Community({ sessionFromServer }) {
  // #### Info for nav menu
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  // ##### end of section for nav menu

  const [IsOpen, SetIsOpen] = useState(true);
  const [tagFilters, setFiltersState] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [addingPost, setAddingPost] = useState(false);
  const [itemEdited, setItemEdited] = useState(false);
  const [sortingvalue, setSortingValue] = useState(-1);
  const [sortingproperty, setSortingProperty] = useState("_id");

  const PAGE_SIZE = itemsPerPage;
  let filteredListLastPage = filteredPosts.length / itemsPerPage;

  const category = [
    {
      category: "BatSignal!",
      _id: "1",
      tags: [
        { _id: "batsignal1", tag: "name suggestions" },
        { _id: "batsignal2", tag: "description suggestions" },
        { _id: "batsignal3", tag: "fundraising ideas" },
        { _id: "batsignal4", tag: "social media ideas" },
        { _id: "batsignal5", tag: "photography ideas" },
        { _id: "batsignal6", tag: "other ideas" },
      ],
    },
    {
      category: "PlayYard & Community",
      _id: "2",
      tags: [
        { _id: "playyard1", tag: "General ChitChat" },
        { _id: "playyard2", tag: "showoff your pets!" },
      ],
    },
    {
      category: "Bugs & Feedback",
      _id: "3",
      tags: [
        { _id: "feedback1", tag: "bugs" },
        { _id: "feedback2", tag: "feedback" },
      ],
    },
  ];
  let tagListProp = category
    .map((category) => category.tags)
    .reduce((sum, value) => sum.concat(value), []);

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

  function setAddingPostFunction() {
    setAddingPost(!addingPost);
  }

  // ########## End of section for passing state into components as functions ####

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    checked
      ? setFiltersState([...tagFilters, value])
      : setFiltersState(tagFilters.filter((tag) => tag != value));

    setPage(1);
  };

  // ########### SWR Section #################
  const getKey = (pageIndex, previousPageData, pagesize) => {
    if (previousPageData && !previousPageData.length) return null;

    return `${
      process.env.NEXT_PUBLIC_BASE_FETCH_URL
    }/api/individualposts/swr/swr?page=${
      pageIndex + 1
    }&limit=${pagesize}&sortingvalue=${sortingvalue}&sortingproperty=${sortingproperty}`; // SWR key, grab data from the next page (pageIndex+1) in each loop
  };

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite(
      (...args) => getKey(...args, PAGE_SIZE, sortingvalue, sortingproperty),
      fetcher
    );

  const posts = data ? [].concat(...data) : [];

  let isAtEnd = data && data[data.length - 1]?.length < 1;

  useEffect(() => {
    if (posts) {
      setFilteredPosts([...posts]);
    }
  }, [data]);
  //data was necessary to make it work with swr, using the names descriptions instead wouldn't trigger a state update

  //#################### END of main swr section ################

  useEffect(() => {
    let currenttags = tagFilters;

    setFilteredPosts(
      posts.filter((post) =>
        currenttags.every((tag) => post.taglist.includes(tag))
      )
    );
  }, [tagFilters, data]);
  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed

  useEffect(() => {
    setPage(1);
  }, [itemsPerPage, sortingvalue, sortingproperty]);

  useEffect(() => {
    if (filteredPosts.length / page < itemsPerPage) {
      setSize(size + 1) && mutate();
    }
  }, [filteredPosts]);

  useEffect(() => {
    mutate();
  }, [itemEdited]);

  return (
    <div>
      <Layout
        profileImage={profileImage}
        userName={userName}
      />

      <PageTitleWithImages
        imgSrc="bg-[url('https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1602871850.792525/best-dog-halloween-costumes-of-2018.jpg')]"
        title="Batsignal &"
        title2="Play-yard"
      />

      <div
        className="mx-auto bg-violet-900 max-w-4xl text-center py-4 border-2 border-violet-400 border-dotted 
                                    shadow-lg shadow-slate-900/100 pl-4"
      >
        <div className="flex">
          <div className="my-auto">
            <Image
              className=" mx-auto rounded-full lg:h-20"
              src="/batsignaldogsrunning.avif"
              width={140}
              height={120}
              alt=""
            />
          </div>
          <div className="my-auto">
            <p className="w-full text-white text-xl mx-auto mt-2 sm:ml-4">
              Come join us in the play yard! Ask for advice, share ideas, or
              just chat!
            </p>
            <GeneralButton
              text={` ${!addingPost ? "Add a new post" : "Cancel"}`}
              className="ml-2 mt-2"
              onClick={() => {
                setAddingPost(!addingPost);
              }}
            />
          </div>
        </div>
      </div>

      {addingPost && (
        <AddPost
          tagListProp={tagListProp}
          sessionFromServer={sessionFromServer}
          setSizeFunction={setSizeFunction}
          size={size}
          setAddingPostFunction={setAddingPostFunction}
        />
      )}

      {/* posts section */}
      <div className="flex max-w-screen">
        <FilteringSidebar
          category={category}
          handleFilterChange={handleFilterChange}
          IsOpen={IsOpen}
        />

        <section className="flex-1 border-2 border-violet-400 ">
          {/* Button that toggles the filter div */}
          <GeneralButton
            className="rounded-l-none"
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
            filterednameslength={filteredPosts.length}
            setSortingLogicFunction={setSortingLogicFunction}
          />

          {isLoading && (
            <div className="flex">
              <span className="text-white text-3xl my-20 mx-auto">
                Fetching data ...
              </span>
            </div>
          )}

          {filteredPosts
            .slice(
              page - 1 == 0 ? 0 : (page - 1) * itemsPerPage,
              page * itemsPerPage
            )
            .map((post) => {
              return (
                <BatsignalPost
                  post={post}
                  key={post._id}
                  className="mx-auto"
                  sessionFromServer={sessionFromServer}
                  tagListProp={tagListProp}
                  setItemEditedFunction={setItemEditedFunction}
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
            filterednameslength={filteredPosts.length}
            setSortingLogicFunction={setSortingLogicFunction}
          />

          <CheckForMoreData
            page={page}
            filteredListLastPage={filteredListLastPage}
            setSizeFunction={setSizeFunction}
            isAtEnd={isAtEnd}
          />
        </section>
      </div>
    </div>
  );
}
