import React from "react";
import SingleComment from "../../../components/ShowingListOfContent/SingleComment";

import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import NavLayoutwithSettingsMenu from "../../../components/NavBar/NavLayoutwithSettingsMenu";
import PageTitleWithImage from "../../../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
export const getServerSideProps = async (context) => {
  const id = context.params.id;

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

  let commentResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/comment/batsignalpostcomment/getaspecificcommentbyid/` +
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
        sessionFromServer: sessionFromServer,
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
        replyingtothisid={commentData2.replyingtothisid}
        rootComment={commentData2}
        typeOfContentReplyingTo="post"
        sessionFromServer={sessionFromServer}
      />
    </div>
  );
}
