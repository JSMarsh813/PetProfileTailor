import React, { useEffect, useState } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import HeadersForCategories from "../components/ShowingListOfContent/HeadersForDescriptions";
import DescriptionListingAsSections from "../components/ShowingListOfContent/DescriptionListingAsSections";

import dbConnect from "../config/connectmongodb";
import Category from "../models/descriptioncategory";
import Description from "../models/description";
import DescriptionTag from "../models/descriptiontag";
import Names from "../models/Names";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const UserId = session ? session.user._id : "";

  dbConnect();
  //############ GETTING CATEGORIES ###########
  // let response = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/descriptioncategory`
  // );
  // let data = await response.json();

  let data = await Category.find().populate("tags");

  const descriptionData = await Description.find()
    .populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    })
    .populate({ path: "tags", select: ["tag"] });

  //######GRABBING DESCRIPTION TAGS #######

  let tagData = await DescriptionTag.find();

  let tagListProp = tagData
    .map((tag) => tag)
    .reduce((sum, value) => sum.concat(value), []);

  //grabbing names

  // let nameList = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/names`
  // );
  // let nameData = await nameList.json();

  return {
    props: {
      category: JSON.parse(JSON.stringify(data)),
      descriptionList: JSON.parse(JSON.stringify(descriptionData)),
      tagList: JSON.parse(JSON.stringify(tagListProp)),
      sessionFromServer: session,
    },
  };
};

function FetchDescriptions({
  sessionFromServer,
  category,
  descriptionList,
  tagList,
}) {
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  //end of section for nav menu
  const [IsOpen, SetIsOpen] = useState(true);

  const [tagFilters, setTagFiltersState] = useState([]);

  const [filteredDescriptions, setFilteredDescriptions] = useState([
    ...descriptionList,
  ]);

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    checked
      ? setTagFiltersState([...tagFilters, value])
      : setTagFiltersState(tagFilters.filter((tag) => tag != value));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let currenttags = tagFilters;

    setFilteredDescriptions(
      descriptionList.filter(
        (description) =>
          currenttags.every((selectedtag) =>
            description.tags.map(({ tag }) => tag).includes(selectedtag)
          )

        //  (description) => console.log(description.tags.map(({ tag }) => tag))
        // turns it into an array of tags ["likes food","large"]
      )
    );
  }, [tagFilters]);

  // console.log(
  //   descriptionList.map((object) =>
  //     object.tags.map((tag) => tag.tag.includes(tag))
  //   )
  // );

  return (
    <div>
      <Layout
        profileImage={profileImage}
        userName={userName}
      />

      {/* {JSON.stringify(filteredDescriptions)} */}
      {JSON.stringify(tagFilters)}

      <section className="px-4 bg-violet-900">
        <PageTitleWithImages
          imgSrc="bg-[url('https://images.pexels.com/photos/1599452/pexels-photo-1599452.jpeg?auto=compress&cs=tinysrgb&w=400')]"
          title="Fetch "
          title2="Descriptions"
        />

        <div className="flex w-full">
          <FilteringSidebar
            category={category}
            handleFilterChange={handleFilterChange}
            IsOpen={IsOpen}
          />

          {/*################# CONTENT DIV ################### */}

          <div className="grow bg-darkPurple rounded-box place-items-center">
            <GeneralButton
              text={`${IsOpen ? "Close Filters" : "Open Filters"}`}
              onClick={() => SetIsOpen(!IsOpen)}
            />

            <section className="border-2 border-amber-300">
              <section className="">
                {filteredDescriptions.map((description) => {
                  return (
                    <DescriptionListingAsSections
                      description={description}
                      key={description._id}
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

export default FetchDescriptions;
