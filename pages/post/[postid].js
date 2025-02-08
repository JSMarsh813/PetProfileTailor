import React, { useEffect, useState } from "react";

import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import "@fortawesome/fontawesome-svg-core/styles.css";
import BatsignalPost from "../../components/ShowingListOfContent/batsignalPost";
import NavLayoutwithSettingsMenu from "../../components/NavBar/NavLayoutwithSettingsMenu";
import Posts from "../../models/Post";

import dbConnect from "../../utils/db";
const ObjectId = require("mongodb").ObjectId;

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  let UserId = "";

  if (session) {
    UserId = session.user._id;
  }

  //allows us to grab the dynamic value from the url
  const id = context.params.postid;
  const postId = ObjectId(id);
  await dbConnect.connect();

  const postData = await Posts.findById(postId).populate({
    path: "createdby",
    select: ["name", "profilename", "profileimage"],
  });

  if (!postData) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        postList: JSON.parse(JSON.stringify(postData)),
        sessionFromServer: session,
      },
    };
  }
};

export default function Postid({ sessionFromServer, postList }) {
  //for Nav menu profile name and image
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  return (
    <div>
      <NavLayoutwithSettingsMenu
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <BatsignalPost
        post={postList}
        key={postList._id}
        className="mx-auto"
        sessionFromServer={sessionFromServer}
      />
    </div>
  );
}
