import React from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import AddingDescription from "../components/AddingNewData/addingdescription";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  //grabbing Tags for description edit function

  let tagList = await fetch(`${process.env.BASE_FETCH_URL}/api/descriptiontag`);
  let tagData = await tagList.json();
  let tagListProp = tagData
    .map((tag) => tag)
    .reduce((sum, value) => sum.concat(value), []);

  //grabbing names

  let nameList = await fetch(`${process.env.BASE_FETCH_URL}/api/names`);
  let nameData = await nameList.json();
  let nameListProp = nameData
    .map((name) => name.name)
    .reduce((sum, value) => sum.concat(value), []);

  console.log(nameListProp);

  return {
    props: {
      sessionFromServer: session,
      tagList: tagListProp,
      nameList: nameListProp,
    },
  };
};

function AddDescriptions({ sessionFromServer, tagList, nameList }) {
  //for Nav menu profile name and image
  let userName = "";
  let profileImage = "";
  let userId = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
    userId = sessionFromServer.user._id;
  }
  //end of section for nav menu

  return (
    <div>
      <Layout
        profileImage={profileImage}
        userName={userName}
      />
      <PageTitleWithImages
        imgSrc="bg-[url('https://images.unsplash.com/photo-1516222338250-863216ce01ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80')]"
        title="Add a"
        title2="Description"
      />
      <AddingDescription
        tagList={tagList}
        userId={userId}
        sessionFromServer={sessionFromServer}
        nameList={nameList}
      />
    </div>
  );
}

export default AddDescriptions;
