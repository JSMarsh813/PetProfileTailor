import React, { useEffect, useState } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import BatsignalPost from "../components/ShowingListOfContent/batsignalPost";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import GeneralButton from "../components//ReusableSmallComponents/buttons/GeneralButton";
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

  // const postData = await IndividualPosts.find()
  //   .populate({
  //     path: "createdby",
  //     select: ["name", "profilename", "profileimage"],
  //   })
  //   .sort({ _id: -1 });
  //this way we get the most recent posts first, we use id since mongoDB's objectID has a 4 byte timestamp naturally built in
  return {
    props: {
      sessionFromServer: session,
      // postList: JSON.parse(JSON.stringify(postData)),
    },
  };
};

export default function BatSignal({ sessionFromServer }) {
  // #### Info for nav menu
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  // ##### end of section for nav menu

  const category = [
    {
      category: "BatSignal!",
      _id: "1",
      tags: [
        { tag: "name suggestions" },
        { tag: "description suggestions" },
        { tag: "fundraising ideas" },
        { tag: "social media ideas" },
        { tag: "photography ideas" },
        { tag: "other ideas" },
      ],
    },
    {
      category: "PlayYard & Community",
      _id: "2",
      tags: [{ tag: "General ChitChat" }, { tag: "showoff your pets!" }],
    },
    {
      category: "Bugs & Feedback",
      _id: "3",
      tags: [{ tag: "bugs" }, { tag: "feedback" }],
    },
  ];

  let tagListProp = category
    .map((category) => category.tags)
    .reduce((sum, value) => sum.concat(value), []);

  const [IsOpen, SetIsOpen] = useState(true);
  const [tagFilters, setFiltersState] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [addingPost, setAddingPost] = useState(false);

  let filteredListLastPage = filteredPosts.length / itemsPerPage;
  const PAGE_SIZE = itemsPerPage;

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

  // ########## End of section for passing state into components as functions ####

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    //every time we click, lets reset filteredPosts to postList aka its initial state. This way if we go backwards/unclick options, we'll regain the names we lost so future filtering is correct.
    // aka round: 1, we click christmas and male. So we lost all female names since they had no male tag
    //      round: 2, we unclick male
    //we need to reset the nameList, so that it will give us ALL christmas names
    // so reset the list with all the names
    // then the filter function in useEffect runs since the filteredtag array was changed

    // name.tags.includes(tag))))
    //We want ONE result for each name, so map through names
    //names ex: beans, santa
    //then we want to look through EVERY tag filter ONCE
    //ex filters: Male and christmas
    // does the name have all of these tags?
    //ex: beans has male, but not christmas. so it'd return false
    //while santa would return true so it's rendered

    //if checked, it will add the new tag to the state/list. If not checked, it will filter it out and replace the state with the new tagfilter array

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
    }/api/individualposts/swr/swr?page=${pageIndex + 1}&limit=${pagesize}`; // SWR key, grab data from the next page (pageIndex+1) in each loop
  };

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite((...args) => getKey(...args, PAGE_SIZE), fetcher);

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
  }, [itemsPerPage]);

  useEffect(() => {
    if (filteredPosts.length / page < itemsPerPage) {
      setSize(size + 1) && mutate();
    }
  }, [filteredPosts]);

  return (
    <div className="pb-8 w-screen ">
      <Layout
        profileImage={profileImage}
        userName={userName}
      />

      <PageTitleWithImages
        imgSrc="bg-[url('https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1602871850.792525/best-dog-halloween-costumes-of-2018.jpg')]"
        title="Batsignal &"
        title2="Play-yard"
      />

      {/* posts section */}
      <section className="flex w-full h-fit bg-darkPurple  rounded-box">
        <FilteringSidebar
          category={category}
          handleFilterChange={handleFilterChange}
          IsOpen={IsOpen}
        />

        <section className="mb-0 w-full flex-1 border-2 border-violet-400 ">
          {/* Button that toggles the filter div */}
          <GeneralButton
            className="rounded-l-none"
            text={`${IsOpen ? "Close Filters" : "Open Filters"}`}
            onClick={() => SetIsOpen(!IsOpen)}
          />

          <div
            className="mx-auto bg-violet-900 max-w-3xl text-center py-4 border-2 border-violet-400 border-dotted 
                                    shadow-lg shadow-slate-900/100"
          >
            <Image
              className="max-h-32 mx-auto rounded-full"
              src="/batsignaldogsrunning.avif"
              width={200}
              height={200}
              alt="picture of two small dogs running in a large grassy area, one which is looking at the screen"
            />

            <p className="w-full text-white text-xl mx-auto mt-2">
              Come join us in the play yard! Ask for advice, share ideas, or
              just chat!
            </p>

            <GeneralButton
              text="Add a Post"
              className="ml-2 mt-2"
              onClick={() => {
                setAddingPost(!addingPost);
              }}
            />
          </div>

          {addingPost && (
            <AddPost
              tagListProp={tagListProp}
              sessionFromServer={sessionFromServer}
              setSizeFunction={setSizeFunction}
              size={size}
            />
          )}

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
          />

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
          />

          <CheckForMoreData
            page={page}
            filteredListLastPage={filteredListLastPage}
            setSizeFunction={setSizeFunction}
            isAtEnd={isAtEnd}
          />
        </section>
      </section>
    </div>
  );
}
