import React from "react";
import NewNameWithTagsData from "../components/AddingNewData/addingName";

import { useSession } from "next-auth/react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

import dbConnect from "../config/connectmongodb";
import NameTag from "../models/NameTag";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  dbConnect();

  const tagData = await NameTag.find();

  return {
    props: {
      tagList: JSON.parse(JSON.stringify(tagData)),
      sessionFromServer: session,
    },
  };
};

function AddNewNameWithTags({ tagList, sessionFromServer }) {
  const { data: session, status } = useSession();

  //need to do let to avoid error if sessionFromServer is null aka not signed in

  let userName = "";
  let profileImage = "";
  let userId = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
    userId = sessionFromServer.user._id;
  }

  return (
    <div className="bg-violet-900 h-full text-white">
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <PageTitleWithImages
        imgSrc="bg-[url('https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/Z5QQMNJZGJDSVJFNHHR3QYNMCE.jpg')] "
        title="Add A"
        title2="Name"
      />

      <div className="mx-auto mt-4 md:px-4">
        {!sessionFromServer && (
          <div className="bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 text-center">
            To avoid spam, users must sign in to add names
          </div>
        )}

        <NewNameWithTagsData
          tagList={tagList}
          userId={userId}
          sessionFromServer={sessionFromServer}
        />
      </div>
    </div>
  );
}

export default AddNewNameWithTags;
