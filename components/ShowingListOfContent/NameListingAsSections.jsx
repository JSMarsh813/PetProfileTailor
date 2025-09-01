import React, { useState, useEffect } from "react";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import FlagButtonAndLogic from "../Flagging/FlagButtonAndLogic";
import DeleteButton from "../DeletingData/DeleteButton";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";

import EditName from "../EditingData/EditName";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
// import SeeCommentsButton from "../ReusableSmallComponents/buttons/SeeCommentsButton";
// import CommentListing from "../ShowingListOfContent/CommentListing";
// import AddComment from "../AddingNewData/AddComment";
import ProfileImage from "../ReusableSmallComponents/ProfileImage";
import FormFlagReport from "../Flagging/FormFlagReport";
import ToggeableAlert from "../ReusableMediumComponents/ToggeableAlert";
import FlaggingContentSection from "../Flagging/FlaggingContentSection";
import removeDeletedContent from "../DeletingData/removeDeletedContent";
import AddHashToArrayString from "../../utils/stringManipulation/addHashToArrayString";

export default function NameListingAsSections({
  name,
  signedInUsersId,
  tagList,
  setNameEditedFunction,
  setDeleteThisContentId,
  likedSetRef,
  recentLikesRef,
}) {
  let userIsTheCreator = name.createdby._id === signedInUsersId;

  let [currentTargetedId, setCurrentTargetedNameId] = useState(name._id);

  //##### STATE FOR DELETIONS ######

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // ##### STATE FOR EDITS ####
  const [showEditPage, setShowEditPage] = useState(false);

  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  //SHARING

  const linkToShare = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/name/${name.name}`;
  const localLink = `/name/${name.name}`;

  // ### for the edit notification button
  function onupdateEditState() {
    setShowEditPage(!showEditPage);
  }

  //for shares
  function onClickShowShares() {
    setShareSectionShowing(!shareSectionShowing);
  }

  return (
    <div className="text-base">
      <div
        className="grid  grid-cols-1
         space-between
        
                
           
            border-b border-violet-300
            bg-primary
                    text-purple-200 sm:p-2 
                  justify-items-center "
        //  items-center
      >
        {/* ###### CREATEDBY SECTION #### */}
        <section className="w-full pt-2 relative h-16">
          {/* height needed otherwise the nonpositioned elements will move up */}
          <div>
            <div className=" absolute left-0">
              <a
                href={`${
                  process.env.NEXT_PUBLIC_BASE_FETCH_URL
                }profile/${name.createdby.profilename.toLowerCase()}`}
                className="flex"
              >
                <ProfileImage
                  divStyling="w-12 mr-4 k"
                  profileImage={name.createdby.profileimage}
                  layout="responsive"
                  className="rounded-2xl"
                  width={80}
                  height={80}
                />

                <div>
                  <span className="font-bold"> {name.createdby.name}</span>
                  <span> @{name.createdby.profilename}</span>
                </div>
              </a>
            </div>
            <span className="font-bold text-lg mx-auto absolute left-1/2 -translate-x-1/2">
              {/* -translate-x-1/2 makes it actually be centered versus just starting the middle*/}{" "}
              {name.name}{" "}
            </span>

            {signedInUsersId && name.createdby._id == signedInUsersId && (
              <div className="my-2 flex w-full justify-around ">
                <EditButton
                  className="ml-2 mr-6"
                  onupdateEditState={onupdateEditState}
                />
                <DeleteButton
                  signedInUsersId={signedInUsersId}
                  contentId={name._id}
                  setDeleteThisContentId={setDeleteThisContentId}
                  contentCreatedBy={name.createdby._id}
                  apiLink="/api/names/"
                />
              </div>
            )}

            {showEditPage && (
              <EditName
                SetShowEditPage={setShowEditPage}
                name={name}
                signedInUsersId={signedInUsersId}
                tagList={tagList}
                setEditedFunction={setNameEditedFunction}
              />
            )}
          </div>
        </section>

        {/* ###### DESCRIPTION SECTION #### */}

        <p className="whitespace-pre-line">
          {name.description && name.description}
        </p>

        {/* ###### TAGS SECTION #### */}
        <span className="my-2"> {AddHashToArrayString(name)} </span>

        {/* ###### LIKES, SHARE, FLAG #### */}

        <div className="w-full flex justify-evenly mt-2 ">
          <LikesButtonAndLikesLogic
            data={name}
            HeartIconStyling="text-xl ml-2 my-auto mx-auto"
            HeartIconTextStyling="mx-2"
            currentTargetedId={currentTargetedId}
            signedInUsersId={signedInUsersId}
            apiBaseLink={`/api/names`}
            likedSetRef={likedSetRef}
            recentLikesRef={recentLikesRef}
          />

          <ShareButton onClickShowShares={onClickShowShares} />

          {/* <SeeCommentsButton
            comments={name.comments.length}
            onupdateCommentShowState={onupdateCommentShowState}
          /> */}
          <FlaggingContentSection
            userIsTheCreator={userIsTheCreator}
            signedInUsersId={signedInUsersId}
            currentTargetedId={currentTargetedId}
            contentType="name"
            content={name}
            apiflagReportSubmission="/api/flag/flagreportsubmission/"
            apiaddUserToFlaggedByArray="/api/flag/addToNamesFlaggedByArray/"
          />
        </div>
      </div>
      {/* ###### END OF LISTING #### */}

      {/* ###### TOGGLES SECTION, pops up underneath listing #### */}

      {shareSectionShowing && (
        <section className="bg-primary py-2">
          <SharingOptionsBar
            linkToShare={linkToShare}
            localLink={localLink}
          />
        </section>
      )}

      {/* {commentsShowing && (
        <section className="bg-violet-900 py-2"> */}
      {/* <AddComment
            apiLink="/api/namecomments/"
            replyingtothisid={name._id}
            hasParent={null}
            signedInUsersId={signedInUsersId}
            replyingtothiscontent={name.name}
          /> */}
      {/* ######### showing comments #########*/}

      {/* {rootComments.map((comment) => {
            return (
              <CommentListing
                replyingtothisid={comment.replyingtothisid}
                rootComment={comment}
                replies={replyComments}
                signedInUsersId={signedInUsersId}
                apiLink="/api/namecomments/"
                likesApiLink="/api/namecomments/updatenamecommentlikes"
                typeOfContentReplyingTo="name"
                key={comment._id}
                replyingtothiscontent={name.name}
                setDeleteThisContentId={setDeleteThisCommentId}
              />
            );
          })} */}
      {/* </section>
      )} */}
    </div>
  );
}
