import { useState } from "react";
import NewNameWithTagsData from "../components/AddingNewData/addingName";

import { useSession } from "next-auth/react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

import dbConnect from "../utils/db";
import Category from "../models/NameCategory";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  await dbConnect.connect();
  const rawCategories = await Category.find().populate("tags");
  const categoryData = rawCategories.map((cat) => ({
    ...cat.toObject(),
    tags: cat.tags.map((tag) => tag.toObject()), // keeps insertion order intact
  }));

  console.log("categoryData", categoryData);

  return {
    props: {
      categoriesWithTags: JSON.parse(JSON.stringify(categoryData)),
      sessionFromServer: session,
    },
  };
};

function AddNewNameWithTags({ sessionFromServer, categoriesWithTags }) {
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
    <div className=" h-full text-white">
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

      <div className="max-w-7xl mx-auto mt-4 flex justify-center text-center">
        {!sessionFromServer && (
          <div className="bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 text-center">
            To avoid spam, users must sign in to add names
          </div>
        )}

        <NewNameWithTagsData
          categoriesWithTags={categoriesWithTags}
          userId={userId}
          sessionFromServer={sessionFromServer}
        />
      </div>
    </div>
  );
}

export default AddNewNameWithTags;
