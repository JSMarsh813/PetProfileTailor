import Select from "react-select";
import React, { useState } from "react";
import axios from "axios";
import NewNameWithTagsData from "../components/AddingNewData/addingName";
//another serverSide props from  let categoryList = await fetch('http://localhost:3000/api/name-categories);
import AddNewTag from "../components/AddingNewData/AddingNewTag";
import { useSession } from "next-auth/react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

export const getServerSideProps = async (context) => {
  let tagList = await fetch("http://localhost:3000/api/nametag");
  let tagData = await tagList.json();

  let categoryList = await fetch("http://localhost:3000/api/namecategories");
  let categoryData = await categoryList.json();

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      tagList: tagData,
      categoryList: categoryData,
      sessionFromServer: session,
    },
  };
  //and provide the data as props to the page by returning an object from the function
};

function AddNewNameWithTags({ tagList, categoryList, sessionFromServer }) {
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
      {/* {console.log(tagList)} */}
      <Layout
        profileImage={profileImage}
        userName={userName}
      />

      <PageTitleWithImages
        imgSrc="bg-[url('https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/Z5QQMNJZGJDSVJFNHHR3QYNMCE.jpg')] "
        title="Add A"
        title2="Name"
      />

      <div
        style={{ width: "700px" }}
        className="mx-auto mt-4 "
      >
        {/* if not signed in, do not allow them to add names */}
        {status != "authenticated" && (
          <div className="bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 text-center">
            {" "}
            To avoid spam, users must sign in to add names{" "}
          </div>
        )}
        {/* if not signed in, allow them to add names */}
        {/* {console.log(`this is session ${sessionFromServer}`)} */}

        <NewNameWithTagsData
          tagList={tagList}
          userId={userId}
          sessionFromServer={sessionFromServer}
        />

        {/* <AddNewTag categoryList={categoryList}/> */}
      </div>
    </div>
  );
}

export default AddNewNameWithTags;
