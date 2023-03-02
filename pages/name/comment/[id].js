import React from "react";
import SingleComment from "../../../components/ShowingListOfContent/SingleComment";

import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import NavLayoutwithSettingsMenu from "../../../components/NavBar/NavLayoutwithSettingsMenu";
import PageTitleWithImage from "../../../components/ReusableSmallComponents/PageTitleWithImages";
export const getServerSideProps = async (context) => {
  const id = context.params.id;

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let UserId = "";

  if (session) {
    UserId = session.user._id;
  }

  let commentResponse = await fetch(
    "http://localhost:3000/api/comment/namecomment/getaspecificcommentbyid/" +
      id
  );
  let commentData = await commentResponse.json();

  if (!commentData) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        commentData: commentData,
        sessionFromServer: session,
      },
    };
  }
};

export default function GetAComment({ commentData, sessionFromServer }) {
  let commentData2 = commentData[0];
  //this allows us to grab the first and only object, out of the commentData array

  return (
    <div>
      <NavLayoutwithSettingsMenu
        profileImage={sessionFromServer.user.profileimage}
        userName={sessionFromServer.user.name}
      />

      <PageTitleWithImage title="Single" title2="Comment" />

      <SingleComment
        replyingtothisid={commentData2.postid}
        rootComment={commentData2}
        typeOfContentReplyingTo="name"
        sessionFromServer={sessionFromServer}
      />
    </div>
  );
}
