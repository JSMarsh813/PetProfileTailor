import React, { useEffect, useState } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import FilteringSidebar from "../components/Filtering/FilteringSidebar";
import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import HeadersForCategories from "../components/ShowingListOfContent/HeadersForDescriptions";
import DescriptionListingAsSections from "../components/ShowingListOfContent/DescriptionListingAsSections";

export const getServerSideProps = async (context) => {
  let response = await fetch("http://localhost:3000/api/descriptioncategory");
  let data = await response.json();

  let descriptionResponse = await fetch(
    "http://localhost:3000/api/description"
  );
  let descriptionData = await descriptionResponse.json();

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const UserId = session ? session.user._id : "";

  let tagList = await fetch("http://localhost:3000/api/descriptiontag");
  let tagData = await tagList.json();

  let tagListProp = tagData
    .map((tag) => tag.tag)
    .reduce((sum, value) => sum.concat(value), []);

  return {
    props: {
      category: data,
      descriptionList: descriptionData,
      tagList: tagListProp,
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

    setFilteredDescriptions(descriptionList);

    checked
      ? setTagFiltersState([...tagFilters, value])
      : setTagFiltersState(tagFilters.filter((tag) => tag != value));
  };

  useEffect(() => {
    let currenttags = tagFilters;

    setFilteredDescriptions(
      filteredDescriptions.filter((description) =>
        currenttags.every((tag) => description.tags.includes(tag))
      )
    );
  }, [tagFilters]);

  return (
    <div>
      <Layout
        profileImage={profileImage}
        userName={userName}
      />

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

          <section className="border-2 border-amber-300 w-full">
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
    </div>
  );
}

export default FetchDescriptions;
