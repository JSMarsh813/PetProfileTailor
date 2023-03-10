import React, { useEffect, useState, useMemo } from "react";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import BatsignalPost from "../components/ShowingListOfContent/BatSignalPost";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import { Pagination } from "@nextui-org/react";
import GeneralButton from "../components//ReusableSmallComponents/buttons/GeneralButton";
import AddPost from "../components/AddingNewData/AddPost";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let postResponse = await fetch(
    `${process.env.BASE_FETCH_URL}/api/individualposts`
  );
  let postData = await postResponse.json();

  return {
    props: {
      sessionFromServer: session,
      postList: postData,
    },
  };
};

export default function BatSignal({
  sessionFromServer,
  pageProps,
  postList,
  commentList,
}) {
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

  const [tagFilters, setFiltersState] = useState([]);

  const [filteredPosts, setFilteredPosts] = useState([...postList]);

  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  const [IsOpen, SetIsOpen] = useState(true);
  //if true, the className for the filter div will be "" (visible)
  //if false, the className for the filter div will be hidden

  const [addingPost, setAddingPost] = useState(false);

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    setFilteredPosts(postList);

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
  };

  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed
  useEffect(() => {
    let currenttags = tagFilters;

    setFilteredPosts(
      filteredPosts.filter((post) =>
        currenttags.every((tag) => post.taglist.includes(tag))
      )
    );
  }, [tagFilters]);

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
            <img
              className="max-h-32 mx-auto rounded-full"
              src="https://images.unsplash.com/photo-1602067340370-bdcebe8d1930?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            />

            <p className="w-full text-white text-xl mx-auto mt-2">
              Come join us in the play yard! Ask for advice, share ideas, or
              just chat!{" "}
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
            />
          )}
          {filteredPosts.map((post) => {
            return (
              <BatsignalPost
                post={post}
                key={post._id}
                className="mx-auto"
                sessionFromServer={sessionFromServer}
                // commentList={commentsforspecificpost}
                tagListProp={tagListProp}
              />
            );
          })}

          <div className="text-center mb-4">
            {/* <Pagination
              rounded
              total={20}
              initialPage={1}
            /> */}
          </div>
        </section>
      </section>
    </div>
  );
}
