import React from "react";
import SingleComment from "../../../components/ShowingListOfContent/SingleComment";

import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import NavLayoutwithSettingsMenu from "../../../components/NavBar/NavLayoutwithSettingsMenu";
import PageTitleWithImage from "../../../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
export const getServerSideProps = async (context) => {
  const id = context.params.id;

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let userName = "";
  let profileImage =
    "https://images.unsplash.com/photo-1611003228941-98852ba62227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFieSUyMGRvZ3xlbnwwfHwwfHw%3D&w=1000&q=80";

  if (session) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  let commentResponse = await fetch(
    "http://localhost:3000/api/comment/batsignalpostcomment/getaspecificcommentbyid/" +
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
        replyingtothisid={commentData2.replyingtothisid}
        rootComment={commentData2}
        typeOfContentReplyingTo="post"
        sessionFromServer={sessionFromServer}
      />
    </div>
  );
}
