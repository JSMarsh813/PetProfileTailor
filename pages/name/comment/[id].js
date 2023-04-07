import React from "react";
import SingleComment from "../../../components/ShowingListOfContent/SingleComment";

import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import NavLayoutwithSettingsMenu from "../../../components/NavBar/NavLayoutwithSettingsMenu";
import PageTitleWithImage from "../../../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

import dbConnect from "../../../config/connectmongodb";
const ObjectId = require("mongodb").ObjectId;
import Comments from "../../../models/namecomment";

export const getServerSideProps = async (context) => {
  const sessionFromServer = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  dbConnect();

  const id = context.params.id;
  // let commentResponse = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/comment/namecomment/getaspecificcommentbyid/` +
  //     id
  // );
  // let commentData = await commentResponse.json();

  const commentId = ObjectId(id);
  const commentData = await Comments.find({
    _id: commentId,
  }).populate({
    path: "createdby",
    select: ["name", "profilename", "profileimage"],
  });
  if (!commentData) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        commentData: JSON.parse(JSON.stringify(commentData)),
        sessionFromServer: JSON.parse(JSON.stringify(sessionFromServer)),
        userName: userName,
        profileImage: profileImage,
      },
    };
  }
};

export default function GetAComment({
  commentData,
  sessionFromServer,
  userName,
  profileImage,
}) {
  let commentDataObject = commentData[0];
  const commentToValues = Object.values(commentDataObject);

  //this allows us to grab the first and only object, out of the commentData array

  return (
    <div>
      <NavLayoutwithSettingsMenu
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <PageTitleWithImage
        title="Single"
        title2="Comment"
      />

      <SingleComment
        replyingtothisid={commentToValues[0]}
        rootComment={commentDataObject}
        typeOfContentReplyingTo="name"
        sessionFromServer={sessionFromServer}
        apilink="/api/namecomments"
        apilinklikes="/api/namecomments/updatenamecommentlikes"
        replyingtothiscontent={commentToValues[2]}
      />
    </div>
  );
}
