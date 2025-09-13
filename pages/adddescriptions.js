import React from "react";
import Layout from "@components/NavBar/NavLayoutwithSettingsMenu";
import PageTitleWithImages from "@components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import AddingDescription from "@components/AddingNewData/addingdescription";

import dbConnect from "@utils/db";

import Names from "@models/Names";
import DescriptionTag from "@/models/DescriptionTag";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  await dbConnect.connect();

  //grabbing Tags for description edit function

  // let tagList = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/descriptiontag`
  // );
  // let tagData = await tagList.json();

  let tagData = await DescriptionTag.find();
  let tagListProp = tagData
    .map((tag) => tag)
    .reduce((sum, value) => sum.concat(value), []);

  //########## grabbing names

  // let nameList = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/names`
  // );
  // let nameData = await nameList.json();
  const nameData = await Names.find();
  let nameListProp = nameData
    .map((name) => name.name)
    .reduce((sum, value) => sum.concat(value), []);

  return {
    props: {
      sessionFromServer: session,
      tagList: JSON.parse(JSON.stringify(tagListProp)),
      nameList: JSON.parse(JSON.stringify(nameListProp)),
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
    userId = sessionFromServer.user.id;
  }
  //end of section for nav menu

  return (
    <div>
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />
      <PageTitleWithImages
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
