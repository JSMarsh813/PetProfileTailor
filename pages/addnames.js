import React from "react";
import NewNameWithTagsData from "../components/AddingNewData/addingName";

import { useSession } from "next-auth/react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";

import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import PageTitleWithImages from "../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

export const getServerSideProps = async (context) => {
  let tagList = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/nametag`
  );
  let tagData = await tagList.json();

  let categoryList = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/namecategories`
  );
  let categoryData = await categoryList.json();

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  //categoryList not needed???
  return {
    props: {
      tagList: tagData,
      categoryList: categoryData,
      sessionFromServer: session,
    },
  };
  //and provide the data as props to the page by returning an object from the function
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
        {status != "authenticated" && (
          <div className="bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 text-center">
            To avoid spam, users must sign in to add names{" "}
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
