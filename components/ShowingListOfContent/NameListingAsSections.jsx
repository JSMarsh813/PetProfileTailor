import React, { useState, useEffect } from "react";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import FlagButtonAndLogic from "../Flagging/FlagButtonAndLogic";
import DeleteButton from "../DeletingData/DeleteButton";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";

import EditName from "../EditingData/EditName";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import SeeCommentsButton from "../ReusableSmallComponents/buttons/SeeCommentsButton";
import CommentListing from "../ShowingListOfContent/CommentListing";
import AddComment from "../AddingNewData/AddComment";
import ProfileImage from "../ReusableSmallComponents/ProfileImage";
import FormFlagReport from "../Flagging/FormFlagReport";
import ToggeableAlert from "../ReusableMediumComponents/ToggeableAlert";
import FlaggingContentSection from "../Flagging/FlaggingContentSection";
import removeDeletedContent from "../DeletingData/removeDeletedContent";

export default function NameListingAsSections({
  name,
  signedInUsersId,
  tagList,
  setNameEditedFunction,
  setDeleteThisContentId,
}) {
  let userIsTheCreator = name.createdby._id === signedInUsersId;

  let [currentTargetedId, setCurrentTargetedNameId] = useState(name._id);

  //##### STATE FOR DELETIONS ######

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // ##### STATE FOR EDITS ####
  const [showEditPage, setShowEditPage] = useState(false);

  //### STATE FOR COMMENTS ######
  const [commentsShowing, SetCommentsShowing] = useState(false);

  const [commentsFromFetch, setCommentsFromFetch] = useState([]);

  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  //SHARING

  const linkToShare = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/name/${name.name}`;
  const localLink = `/name/${name.name}`;

  const [deleteThisCommentId, setDeleteThisCommentId] = useState(null);

  useEffect(() => {
    console.log(`this is the commentid to delete ${deleteThisCommentId}`);

    if (deleteThisCommentId !== null) {
      removeDeletedContent(
        setCommentsFromFetch,
        commentsFromFetch,
        deleteThisCommentId,
        setDeleteThisCommentId,
      );
    }
  }, [deleteThisCommentId]);

  // ### for the edit notification button
  function onupdateEditState() {
    setShowEditPage(!showEditPage);
  }

  //for shares
  function onClickShowShares() {
    setShareSectionShowing(!shareSectionShowing);
  }

  //########## for comments
  function onupdateCommentShowState() {
    SetCommentsShowing(!commentsShowing);
  }

  const handleFetchComments = async () => {
    const response = await fetch(
      "/api/names/commentscontainingnameid/" + name._id,
    );
    const data = await response.json();

    setCommentsFromFetch(data);
  };

  useEffect(() => {
    handleFetchComments();
  }, []);

  //root comments
  let rootComments = [];

  if (commentsFromFetch) {
    rootComments = commentsFromFetch.filter(
      (comment) =>
        comment.replyingtothisid === name._id &&
        comment.parentcommentid === null,
    );
  }

  //reply comments
  let replyComments = "";

  if (commentsFromFetch) {
    replyComments = commentsFromFetch.filter(
      (comment) => comment.parentcommentid != null,
    );
  }

  return (
    <div className="text-base">
      <div
        className="grid  grid-cols-1
         space-between
        
            xl:grid-cols-6          
           
            border-b-4 border-amber-300
            bg-darkPurple
                    text-purple-200 sm:p-2 
                  justify-items-center"
        //  items-center
      >
        {/* ###### LIKES SECTION #### */}

        <div className="w-full flex justify-evenly mt-2">
          <LikesButtonAndLikesLogic
            data={name}
            HeartIconStyling="text-3xl ml-2"
            HeartIconTextStyling="ml-2"
            currentTargetedId={currentTargetedId}
            signedInUsersId={signedInUsersId}
            apiLink="/api/names/updateLikes"
          />

          <ShareButton onClickShowShares={onClickShowShares} />

          <SeeCommentsButton
            comments={name.comments.length}
            onupdateCommentShowState={onupdateCommentShowState}
          />
        </div>
        {/* ###### NAME SECTION #### */}
        <div className="py-4">
          <span className="font-bold mx-auto"> {name.name} </span>
        </div>
        {/* ###### DESCRIPTION SECTION #### */}
        <span className="pb-2">
          {name.description[0] == "" ? "no description" : name.description}
        </span>

        {/* ###### TAGS SECTION #### */}
        <span className="pb-2">
          {name.tags.map((names) => names.tag).join(", ")}
        </span>

        {/* ###### CREATEDBY SECTION #### */}
        <section
          className="w-full grid grid-cols-1
         justify-items-center bg-violet-900  py-2"
        >
          <a
            href={`${
              process.env.NEXT_PUBLIC_BASE_FETCH_URL
            }profile/${name.createdby.profilename.toLowerCase()}`}
          >
            <ProfileImage
              divStyling="w-12 mx-auto"
              profileImage={name.createdby.profileimage}
              layout="responsive"
              className="rounded-2xl"
              width={80}
              height={80}
            />

            <div className="xl:grid">
              <span className="mx-auto"> {name.createdby.name}</span>
              <span> @{name.createdby.profilename}</span>
            </div>
          </a>

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
        </section>

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
      {/* ###### END OF LISTING #### */}

      {/* ###### TOGGLES SECTION, pops up underneath listing #### */}

      {shareSectionShowing && (
        <section className="bg-violet-900 py-2">
          <SharingOptionsBar
            linkToShare={linkToShare}
            localLink={localLink}
          />
        </section>
      )}

      {commentsShowing && (
        <section className="bg-violet-900 py-2">
          <AddComment
            apiLink="/api/namecomments/"
            replyingtothisid={name._id}
            hasParent={null}
            signedInUsersId={signedInUsersId}
            replyingtothiscontent={name.name}
          />
          {/* ######### showing comments #########*/}

          {rootComments.map((comment) => {
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
          })}
        </section>
      )}
    </div>
  );
}
