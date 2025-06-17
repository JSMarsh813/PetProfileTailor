import React, { useEffect, useState } from "react";

import AddComment from "../AddingNewData/AddComment";
import CommentListing from "./CommentListing";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import EditPost from "../EditingData/EditPost";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";
import DeleteButton from "../DeletingData/DeleteButton";
import SeeCommentsButton from "../ReusableSmallComponents/buttons/SeeCommentsButton";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import PostersImageUsernameProfileName from "../ReusableSmallComponents/PostersImageUsernameProfileName";
import Image from "next/image";
import FlaggingContentSection from "../Flagging/FlaggingContentSection";

import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import removeDeletedContent from "../DeletingData/removeDeletedContent";

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
  const tagList = post.taglist.map((tag) => "#" + tag).join(", ");
  const postId = post._id;
  const showtime = true;

  const [
    postsCommentsAndRepliesFromFetch,
    setPostsCommentsAndRepliesFromFetch,
  ] = useState([]);
  const [postsComments, setPostsComments] = useState([]);
  const [repliesToComments, setRepliesToComments] = useState([]);
  const [commentsShowing, SetCommentsShowing] = useState(false);

  // if a comment or reply is rendered, we'll retrigger the fetch so the list will get the new content added to it. React will see the new content then render the new comment or reply
  const [thereIsANewComment, setThereIsANewComment] = useState(false);
  const [thereIsANewReply, setThereIsANewReply] = useState(false);
  //deletion
  const [deleteThisCommentId, setDeleteThisCommentId] = useState(null);

  let amountOfComments = postsCommentsAndRepliesFromFetch.length;

  //for editing
  const [showEditPage, SetShowEditPage] = useState(false);

  //for showing share buttons
  const [shareSectionShowing, setShareSectionShowing] = useState(false);
  const linkToShare = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/post/${post._id}`;
  const localLink = `/post/${post._id}`;

  // ### grab all the 1. post comments and 2. replies to comments for this post
  const handleFetchPostsCommentsAndReplies = async () => {
    const response = await fetch(
      "/api/individualbatsignalcomments/commentscontainingpostid/" + postId,
    );
    const data = await response.json();
    setPostsCommentsAndRepliesFromFetch(data);
  };

  useEffect(() => {
    handleFetchPostsCommentsAndReplies();
  }, []);

  // ###### POST COMMENTS ONLY (responding to the post not replying to a comment)
  useEffect(() => {
    let topLevelComment = postsCommentsAndRepliesFromFetch.filter(
      (comment) =>
        comment.replyingtothisid === post._id &&
        comment.parentcommentid === null,
    );
    setPostsComments(topLevelComment);
  }, [postsCommentsAndRepliesFromFetch]);

  // ######## REPLIES DATA (responding to a comment, not the post itself) ################

  useEffect(() => {
    // this will grab JUST the replies
    // normal comments are not responding to another comment so their parent comment id is null
    // replies WILL have a parentcomment
    setRepliesToComments(
      postsCommentsAndRepliesFromFetch.filter(
        (comment) => comment.parentcommentid != null,
      ),
    );
  }, [postsCommentsAndRepliesFromFetch, thereIsANewReply]);

  // if a comment is added, grab the post's comments again. React will only render the new item
  useEffect(() => {
    if (thereIsANewComment !== false) {
      handleFetchPostsCommentsAndReplies();
      SetCommentsShowing(true);
      setThereIsANewComment(false);
    }
  }, [thereIsANewComment]);

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

  // if a comment is deleted, this will make it disappear from the screen without rerouting/refreshing the page
  useEffect(() => {
    if (deleteThisCommentId !== null) {
      removeDeletedContent(
        setPostsCommentsAndRepliesFromFetch,
        postsCommentsAndRepliesFromFetch,
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
                alt={post.alttext || ""}
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
              currentTargetedId={postId}
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
            currentTargetedId={postId}
            contentType="post"
            content={post}
            apiflagReportSubmission="/api/flag/flagreportsubmission/"
            apiaddUserToFlaggedByArray="/api/flag/addToPostsFlaggedByArray/"
          />

          <AddComment
            replyingtothisid={postId}
            parentcommentid={null}
            signedInUsersId={signedInUsersId}
            sessionFromServer={sessionFromServer}
            apiLink="/api/individualbatsignalcomments/"
            replyingtothiscontent="post"
            setThereIsANewComment={setThereIsANewComment}
            setThereIsANewReply={setThereIsANewReply}
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
          postsComments.map((topLevelComment) => (
            <CommentListing
              key={topLevelComment._id}
              signedInUsersId={signedInUsersId}
              rootComment={topLevelComment}
              replies={repliesToComments}
              postid={postId}
              typeOfContentReplyingTo="post"
              sessionFromServer={sessionFromServer}
              apiLink="/api/individualbatsignalcomments/"
              likesApiLink="/api/individualbatsignalcomments/updatecommentlikes"
              setDeleteThisContentId={setDeleteThisCommentId}
              setThereIsANewComment={setThereIsANewComment}
              setThereIsANewReply={setThereIsANewReply}
            />
          ))}
      </div>
    </div>
  );
}

export default BatsignalPost;
