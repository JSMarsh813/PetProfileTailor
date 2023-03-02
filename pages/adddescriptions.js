import React from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import PageTitleWithImages from "../components/ReusableSmallComponents/PageTitleWithImages";

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

  let tagList = await fetch("http://localhost:3000/api/descriptiontag");
  let tagData = await tagList.json();
  let tagListProp = tagData
    .map((tag) => tag.tag)
    .reduce((sum, value) => sum.concat(value), []);

  console.log(tagListProp);

  return {
    props: {
      sessionFromServer: session,
      tagList: tagListProp,
    },
  };
};

function AddDescriptions({ sessionFromServer, tagList }) {
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
      <Layout profileImage={profileImage} userName={userName} />
      <PageTitleWithImages
        imgSrc="bg-[url('https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1602871850.792525/best-dog-halloween-costumes-of-2018.jpg')]"
        title="Add a"
        title2="Description"
      />
      <AddingDescription
        tagList={tagList}
        userId={userId}
        sessionFromServer={sessionFromServer}
      />
      To be added later!{" "}
    </div>
  );
}

export default AddDescriptions;
