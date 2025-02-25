import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AddComment from "../AddingNewData/AddComment";
import axios from "axios";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import PostersImageUsernameProfileName from "../ReusableSmallComponents/PostersImageUsernameProfileName";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";
import DeleteButton from "../DeletingData/DeleteButton";

import EditComment from "../EditingData/EditComment";
import removeDeletedContent from "../DeletingData/removeDeletedContent";

import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import FlaggingContentSection from "../Flagging/FlaggingContentSection";

function CommentListing({
  replyingtothisid,
  rootComment,
  replies,
  sessionFromServer,
  signedInUsersId,
  apiLink,
  likesApiLink,
  typeOfContentReplyingTo,
  replyingtothiscontent,
  setDeleteThisContentId,
  setThereIsANewComment,
  setThereIsANewReply,
}) {
  const [deleteThisReplyId, setDeleteThisReplyId] = useState(null);
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);
  const [listOfReplies, setListOfReplies] = useState(replies);
  const [commentParentId, setCommentParentId] = useState(null);
  const [postersName, setPostersName] = useState(rootComment.createdby.name);
  const [postersProfileImage, setPostersProfileImage] = useState(
    rootComment.createdby.profileimage,
  );
  const [postersProfileName, setProfileName] = useState(
    rootComment.createdby.profilename,
  );
  const [adjustedParentId, setAdjustedParentId] = useState("");

  const showtime = true;
  let userIsTheCreator = rootComment.createdby._id === signedInUsersId;

  let [currentTargetedId, setCurrentTargetedDescriptionId] = useState(
    rootComment._id,
  );

  useEffect(() => {
    if (deleteThisReplyId !== null) {
      removeDeletedContent(
        setListOfReplies,
        listOfReplies,
        deleteThisReplyId,
        setDeleteThisReplyId,
      );
    }
  }, [deleteThisReplyId]);

  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  const linkToShare = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${typeOfContentReplyingTo}/comment/${rootComment._id}`;
  const localLink = `/${typeOfContentReplyingTo}/comment/${rootComment._id}`;

  useEffect(() => {
    {
      rootComment.parentcommentid
        ? setAdjustedParentId(rootComment.parentcommentid)
        : setAdjustedParentId(rootComment._id);
    }
    //We only go one level deep. If the comment already has a parent id then we're already one level deep. So we want to set the id of this new comment as the same as this comment's parentcommendid

    //otherwise we are not one level deep/this is the first reply. So we can grab this comments id as the parentcommentid
  }, []);

  //for editing
  const [showEditPage, SetShowEditPage] = useState(false);

  const [commentChanged, setCommentChanged] = useState(false);

  function updateEditState() {
    SetShowEditPage(true);
  }

  //for shares
  function onClickShowShares() {
    setShareSectionShowing(!shareSectionShowing);
  }

  return (
    <div
      className={`flex-col mx-auto py-2 pr-4 text-darkPurple
                rounded-lg ${rootComment.parentcommentid ? "pl-6 pr-0" : ""}`}
    >
      <div className="flex flex-row bg-violet-50 p-2">
        <div className="w-full mt-1 ml-6">
          <PostersImageUsernameProfileName
            postersProfileImage={postersProfileImage}
            postersName={postersName}
            profileName={postersProfileName}
            postDate={rootComment.createdAt}
            showtime={showtime}
          />

          <div className=" px-2 ml-2 text-sm font-medium leading-loose text-left">
            {rootComment.description}
          </div>

          <div className="text-left ml-2 mt-2 grid grid-cols-2 gap-x-8">
            <div className="place-self-start">
              <LikesButtonAndLikesLogic
                data={rootComment}
                HeartIconStyling="text-3xl"
                HeartIconTextStyling="text-darkPurple ml-2"
                signedInUsersId={signedInUsersId}
                session={sessionFromServer}
                apiLink={likesApiLink}
              />

              <FontAwesomeIcon
                icon={faCommentDots}
                className="ml-2 mr-4 text-darkPurple text-3xl"
                onClick={() => {
                  setShowAddCommentForm(!showAddCommentForm);
                }}
              ></FontAwesomeIcon>

              <ShareButton
                onClickShowShares={onClickShowShares}
                shareIconStyling="text-darkPurple"
              />
            </div>

            {userIsTheCreator && (
              <div className="place-self-end mr-2">
                <EditButton
                  className="mr-4"
                  onupdateEditState={updateEditState}
                />

                <DeleteButton
                  signedInUsersId={signedInUsersId}
                  contentId={rootComment._id}
                  setUpdateListOfContent={setListOfReplies}
                  listOfContent={listOfReplies}
                  contentCreatedBy={rootComment.createdby._id}
                  apiLink={apiLink}
                  setDeleteThisContentId={setDeleteThisContentId}
                />
              </div>
            )}

            {showEditPage && (
              <EditComment
                SetShowEditPage={SetShowEditPage}
                replyingtothisid={replyingtothisid}
                rootComment={rootComment}
                sessionFromServer={sessionFromServer}
                changeCommentState={setCommentChanged}
                apiLink={apiLink}
              />
            )}
          </div>

          <FlaggingContentSection
            userIsTheCreator={userIsTheCreator}
            signedInUsersId={signedInUsersId}
            currentTargetedId={currentTargetedId}
            contentType="comment"
            content={rootComment}
            apiflagReportSubmission="/api/flag/flagreportsubmission/"
            apiaddUserToFlaggedByArray="/api/flag/addToForumCommentsFlaggedByArray/"
          />

          {shareSectionShowing && (
            <section className="bg-violet-900 py-2">
              <SharingOptionsBar
                linkToShare={linkToShare}
                localLink={localLink}
              />
            </section>
          )}

          {showAddCommentForm && (
            <AddComment
              apiLink={apiLink}
              replyingtothisid={rootComment.replyingtothisid}
              parentcommentid={adjustedParentId}
              signedInUsersId={signedInUsersId}
              replyingtothiscontent={replyingtothiscontent}
              setThereIsANewComment={setThereIsANewComment}
              setThereIsANewReply={setThereIsANewReply}
              setShowAddCommentForm={setShowAddCommentForm}
            />
          )}
        </div>
      </div>

      {/* if replies exist for this post, loop through them. If their parentcommentid matches this current comment, then add it to the bottom of this comment.
          Otherwise do not add it to the bottom of this comment. */}
      {replies &&
        listOfReplies.map((reply) => {
          if (reply.parentcommentid == rootComment._id) {
            return (
              <div key={reply._id}>
                <CommentListing
                  key={`comment${reply._id}`}
                  rootComment={reply}
                  replies={null}
                  signedInUsersId={signedInUsersId}
                  sessionFromServer={sessionFromServer}
                  apiLink={apiLink}
                  likesApiLink={likesApiLink}
                  typeOfContentReplyingTo="name"
                  setDeleteThisContentId={setDeleteThisReplyId}
                  setThereIsANewComment={setThereIsANewComment}
                  setThereIsANewReply={setThereIsANewReply}
                />
              </div>
            );
          }
        })}
    </div>
  );
}

export default CommentListing;
