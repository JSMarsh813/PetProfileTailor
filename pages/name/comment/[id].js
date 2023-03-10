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

  if (session) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  let commentResponse = await fetch(
    `${process.env.BASE_FETCH_URL}/api/comment/namecomment/getaspecificcommentbyid/` +
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
  let commentData2 = commentData[0];
  //this allows us to grab the first and only object, out of the commentData array

  return (
    <div>
      <NavLayoutwithSettingsMenu
        profileImage={profileImage}
        userName={userName}
      />

      <PageTitleWithImage
        title="Single"
        title2="Comment"
      />

      <SingleComment
        replyingtothisid={commentData2.postid}
        rootComment={commentData2}
        typeOfContentReplyingTo="name"
        sessionFromServer={sessionFromServer}
      />
    </div>
  );
}
