import React, { useEffect, useState } from "react";

import AddComment from "../AddingNewData/AddComment";
import CommentListing from "./CommentListing";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import EditPost from "../EditingData/EditPost";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";
import DeleteButton from "../DeletingData/DeleteButton";
import DeletePostNotification from "../DeletingData/DeletePostNotification";
import SeeCommentsButton from "../ReusableSmallComponents/buttons/SeeCommentsButton";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import PostersImageUsernameProfileName from "../ReusableSmallComponents/PostersImageUsernameProfileName";
import Image from "next/image";
import FlaggingContentSection from "../Flagging/FlaggingContentSection";
import { useRouter } from "next/router";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import removeDeletedContent from "../DeletingData/RemoveDeletedContent";

function BatsignalPost({
  className,
  sessionFromServer,
  post,
  tagListProp,
  setItemEditedFunction,
  signedInUsersId,
  setDeleteThisContentId,
}) {
  let contentCreatedBy = post.createdby._id;
  let userIsTheCreator = contentCreatedBy === signedInUsersId;

  const image = post.image;
  const title = post.title;
  const paragraphText = post.description;
  const postersName = post.createdby.name;
  const profileName = post.createdby.profilename;
  const postersProfileImage = post.createdby.profileimage;
  const postDate = post.createdAt;

  const shares = post.shares;
  const likes = post.likes;
  const tagList = post.taglist.map((tag) => "#" + tag).join(", ");
  const postId = post._id;

  const showtime = true;

  const [postsCommentsFromFetch, setPostsCommentsFromFetch] = useState([]);

  //for comments
  const [commentsShowing, SetCommentsShowing] = useState(false);
  const [deleteThisCommentId, setDeleteThisCommentId] = useState(null);

  let rootComments = [];

  if (postsCommentsFromFetch) {
    rootComments = postsCommentsFromFetch.filter(
      (comment) =>
        comment.replyingtothisid === post._id &&
        comment.parentcommentid === null,
    );
  }

  let amountOfComments = rootComments.length;

  //for editing
  const [showEditPage, SetShowEditPage] = useState(false);

  //for deleting
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  //for showing share buttons
  const [shareSectionShowing, setShareSectionShowing] = useState(false);
  const linkToShare = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/post/${post._id}`;
  const localLink = `/post/${post._id}`;

  let replyComments = "";
  if (postsCommentsFromFetch) {
    replyComments = postsCommentsFromFetch.filter(
      (comment) => comment.parentcommentid != null,
    );
  }
  //for likes
  const [currentTargetedId, setCurrentTargetedId] = useState(postId);
  //if the post is edited, we will refresh this component

  const handleFetchPosts = async () => {
    const response = await fetch(
      "/api/individualbatsignalcomments/commentscontainingpostid/" + postId,
    );
    const data = await response.json();
    setPostsCommentsFromFetch(data);
  };

  useEffect(() => {
    handleFetchPosts();
  }, []);

  function updateEditState() {
    SetShowEditPage(true);
    //passing set state directly as a prop isn't best practice, instead passing a function is better
    // https://www.reddit.com/r/learnreactjs/comments/m99nbz/is_it_a_good_practice_to_pass_setstate_of_one/
  }

  function updateCommentShowState() {
    SetCommentsShowing(!commentsShowing);
  }

  function onClickShowShares() {
    setShareSectionShowing(!shareSectionShowing);
  }

  useEffect(() => {
    console.log(`this is the commentid to delete ${deleteThisCommentId}`);

    if (deleteThisCommentId !== null) {
      removeDeletedContent(
        setPostsCommentsFromFetch,
        postsCommentsFromFetch,
        deleteThisCommentId,
        setDeleteThisCommentId,
      );
    }
  }, [deleteThisCommentId]);

  return (
    <div
      className="mx-auto sm:px-6 py-8 bg-darkPurple
             "
    >
      <span className="bg-white"></span>
      {/* above is the background of posts
                below is the start of the post squares */}
      {showEditPage && (
        <EditPost
          SetShowEditPage={SetShowEditPage}
          sessionFromServer={sessionFromServer}
          tagListProp={tagListProp}
          post={post}
          // setToastMessage={setToastMessage}
          setItemEditedFunction={setItemEditedFunction}
        />
      )}

      {/* WRAPPING POST AND POST'S COMMENT SECTION */}

      <div
        className={`bg-violet-900 text-white rounded-lg tracking-wide max-w-3xl text-center mx-auto shadow-lg shadow-slate-900/70 border-2 border-violet-400 ${className} pb-4`}
      >
        {/* ######## POST SECTION ###########*/}
        <section className="px-4 py-2 mt-2 flex-1  ">
          {sessionFromServer &&
            post.createdby._id == sessionFromServer.user._id && (
              <div className="grid grid-cols-2">
                <EditButton onupdateEditState={updateEditState} />
                <DeleteButton
                  signedInUsersId={signedInUsersId}
                  contentId={post._id}
                  setDeleteThisContentId={setDeleteThisContentId}
                  contentCreatedBy={contentCreatedBy}
                  apiLink="/api/individualposts/"
                />
              </div>
            )}

          <h2 className="font-semibold text-2xl tracking-normal text-center">
            {title}
          </h2>

          {image.length != 0 && (
            <div className="md:flex-shrink-0 pt-4">
              <img
                src={post.image}
                alt={post.alttext}
                className="max-w-full mx-auto max-h-96 rounded-lg rounded-b-none"
              />
            </div>
          )}
          <p className="text-sm py-2 px-2 mr-1 whitespace-pre-line">
            {paragraphText}
          </p>

          <PostersImageUsernameProfileName
            postersProfileImage={postersProfileImage}
            postersName={postersName}
            profileName={profileName}
            postDate={postDate}
            showtime={showtime}
          />

          <h4 className="text-base">Tags: {tagList}</h4>

          <div className="flex border-y-2 border-slate-200 py-2 bg-violet-900 text-white justify-between">
            <LikesButtonAndLikesLogic
              data={post}
              signedInUsersId={signedInUsersId}
              currentTargetedId={currentTargetedId}
              HeartIconStyling="text-3xl"
              session={sessionFromServer}
              apiLink="/api/individualposts/updatepostlikes"
            />

            <SeeCommentsButton
              comments={amountOfComments}
              onupdateCommentShowState={updateCommentShowState}
            />

            <ShareButton
              shares={shares}
              onClickShowShares={onClickShowShares}
            />
          </div>

          <FlaggingContentSection
            userIsTheCreator={userIsTheCreator}
            signedInUsersId={signedInUsersId}
            currentTargetedId={currentTargetedId}
            contentType="post"
            content={post}
            apiflagReportSubmission="/api/flag/flagreportsubmission/"
            apiaddUserToFlaggedByArray="/api/flag/addToPostsFlaggedByArray/"
          />

          <AddComment
            replyingtothisid={postId}
            parentcommentid={null}
            sessionFromServer={sessionFromServer}
            apiLink="/api/individualbatsignalcomments/"
            replyingtothiscontent="post"
          />
        </section>

        {/* SHARING OPTIONS SECTION */}
        {shareSectionShowing && (
          <SharingOptionsBar
            linkToShare={linkToShare}
            localLink={localLink}
          />
        )}

        {/* ######## POST'S COMMENTS SECTION ###########*/}

        {commentsShowing &&
          rootComments != [] &&
          rootComments.map((comment) => (
            <CommentListing
              key={comment._id}
              signedInUsersId={signedInUsersId}
              rootComment={comment}
              replies={replyComments}
              postid={postId}
              typeOfContentReplyingTo="post"
              sessionFromServer={sessionFromServer}
              apiLink="/api/individualbatsignalcomments/"
              likesApiLink="/api/individualbatsignalcomments/updatecommentlikes"
              setDeleteThisContentId={setDeleteThisCommentId}
            />
          ))}
      </div>
    </div>
  );
}

export default BatsignalPost;
