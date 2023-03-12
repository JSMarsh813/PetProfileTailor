import React, { useEffect, useState } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import HeadersForNames from "../components/ShowingListOfContent/HeadersForNames";
import NameListingAsSections from "../components/ShowingListOfContent/NameListingAsSections";

import dbConnect from "../config/connectmongodb";
import Category from "../models/nameCategory";
import NameTag from "../models/NameTag";
import Names from "../models/Names";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  dbConnect();

  //grabbing category's

  const data = await Category.find().populate("tags");

  //grabbing names
  const nameData = await Names.find()
    .populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    })
    .populate({ path: "tags", select: ["tag"] });

  //grabbing Tags for name edit function

  const tagData = await NameTag.find();
  let tagListProp = tagData
    .map((tag) => tag)
    .reduce((sum, value) => sum.concat(value), []);

  return {
    props: {
      category: JSON.parse(JSON.stringify(data)),
      nameList: JSON.parse(JSON.stringify(nameData)),
      sessionFromServer: session,
      tagList: JSON.parse(JSON.stringify(tagListProp)),
    },
  };
};

export default function FetchNames({
  category,
  nameList,
  sessionFromServer,
  tagList,
}) {
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  //  ################ sets up the toggle for the filter div #############################
  const [IsOpen, SetIsOpen] = useState(true);

  const [tagFilters, setTagFiltersState] = useState([]);

  const [filterednames, setFilteredNames] = useState([...nameList]);

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    checked
      ? setTagFiltersState([...tagFilters, value])
      : setTagFiltersState(tagFilters.filter((tag) => tag != value));
  };

  // every time a new tag is added to the tagsFilter array, we want to filter the names and update the filteredNames state, so we have useEffect run every time tagFilters is changed

  useEffect(() => {
    let currenttags = tagFilters;

    //every time we click, lets start off with nameList aka its initial state. This way if we go backwards/unclick options, we'll regain the names we lost so future filtering is correct.
    // aka round: 1, we click christmas and male. So we lost all female names since they had no male tag
    //      round: 2, we unclick male

    setFilteredNames(
      nameList.filter((names) =>
        currenttags.every((selectedtag) =>
          names.tags.map(({ tag }) => tag).includes(selectedtag)
        )
      )
    );
  }, [tagFilters]);

  return (
    <div className="bg-violet-900">
      <Layout
        profileImage={profileImage}
        userName={userName}
      />

      <section className="px-4 bg-violet-900">
        <PageTitleWithImages
          title="Fetch"
          title2="Names"
        />

        <div className="flex w-full">
          {/* ###################### FILTER DIV ############################ */}

          <FilteringSidebar
            category={category}
            handleFilterChange={handleFilterChange}
            IsOpen={IsOpen}
          />

          {/*################# CONTENT DIV ################### */}

          <div className="grow bg-darkPurple rounded-box place-items-center">
            {/* Button that toggles the filter div */}
            <GeneralButton
              text={`${IsOpen ? "Close Filters" : "Open Filters"}`}
              onClick={() => SetIsOpen(!IsOpen)}
            />

            <section className="border-2 border-amber-300 w-full">
              <HeadersForNames />

              <section className="whitespace-pre-line">
                {filterednames.map((name) => {
                  return (
                    <NameListingAsSections
                      name={name}
                      key={name._id}
                      sessionFromServer={sessionFromServer}
                      tagList={tagList}
                    />
                  );
                })}
              </section>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
