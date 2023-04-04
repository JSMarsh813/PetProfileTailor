import React, { useState, useEffect } from "react";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import DeleteButton from "../ReusableSmallComponents/buttons/DeleteButton";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";
import { useRouter } from "next/router";
import DeleteItemNotification from "../DeletingData/DeleteItemNotification";
import EditName from "../EditingData/EditName";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import SeeCommentsButton from "../ReusableSmallComponents/buttons/SeeCommentsButton";
import CommentListing from "../ShowingListOfContent/CommentListing";
import AddComment from "../AddingNewData/AddComment";
import Image from "next/image";

export default function NameListingAsSections({
  name,
  sessionFromServer,
  tagList,
  setNameEditedFunction,
}) {
  const router = useRouter();
  //############## STATE FOR LIKES #######

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

  const linkToShare = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/name/${name.name}`;
  const localLink = `/name/${name.name}`;

  // ##for the delete notification button #####

  function updateDeleteState() {
    setShowDeleteConfirmation(true);
  }

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
      "/api/names/commentscontainingnameid/" + name._id
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
        comment.parentcommentid === null
    );
  }

  //reply comments
  let replyComments = "";

  if (commentsFromFetch) {
    replyComments = commentsFromFetch.filter(
      (comment) => comment.parentcommentid != null
    );
  }

  return (
    <div className="text-base">
      <div
        className="grid 
            lg:grid-cols-5
            grid-cols-2
            sm:grid-cols-3 lg:gap-3 
            border-b-2 border-amber-300
            bg-darkPurple
                    text-purple-200 sm:p-2  
                    
                    
                    items-center justify-items-center"
      >
        {/* ###### LIKES SECTION #### */}

        <div>
          <LikesButtonAndLikesLogic
            data={name}
            HeartIconStyling="text-2xl"
            HeartIconTextStyling="ml-2"
            currentTargetedId={currentTargetedId}
            session={sessionFromServer}
            apiLink="/api/auth/updateLikes"
          />
          <ShareButton onClickShowShares={onClickShowShares} />

          <SeeCommentsButton
            comments={commentsFromFetch.length}
            onupdateCommentShowState={onupdateCommentShowState}
          />
        </div>
        {/* ###### NAME SECTION #### */}
        <span className=""> {name.name} </span>

        {/* ###### DESCRIPTION SECTION #### */}
        <span className="ml-4">
          {name.description[0] == "" ? "no description" : name.description}
        </span>

        {/* ###### TAGS SECTION #### */}
        <span>{name.tags.map((names) => names.tag).join(", ")}</span>

        {/* ###### CREATEDBY SECTION #### */}
        <section>
          <a
            href={`${
              process.env.NEXT_PUBLIC_BASE_FETCH_URL
            }/profile/${name.createdby.profilename.toLowerCase()}`}
          >
            <Image
              src={name.createdby.profileimage}
              className="rounded-2xl"
              width={80}
              height={80}
              alt=""
            />

            <div>
              <span> {name.createdby.name}</span>
              <span> @{name.createdby.profilename}</span>
            </div>
          </a>

          {sessionFromServer &&
            name.createdby._id == sessionFromServer.user._id && (
              <div className="my-2">
                <EditButton
                  className="ml-2 mr-6"
                  onupdateEditState={onupdateEditState}
                />
                <DeleteButton onupdateDeleteState={updateDeleteState} />
              </div>
            )}

          {showDeleteConfirmation && (
            <DeleteItemNotification
              setShowDeleteConfirmation={setShowDeleteConfirmation}
              sessionFromServer={sessionFromServer}
              setEditedFunction={setNameEditedFunction}
              itemId={name._id}
              itemCreatedBy={name.createdby._id}
              deletionApiPath="/api/names/"
            />
          )}

          {showEditPage && (
            <EditName
              SetShowEditPage={setShowEditPage}
              name={name}
              sessionFromServer={sessionFromServer}
              tagList={tagList}
              setEditedFunction={setNameEditedFunction}
            />
          )}
        </section>
      </div>

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
            sessionFromServer={sessionFromServer}
            replyingtothiscontent={name.name}
          />
          {/* ######### showing comments #########*/}

          {rootComments.map((comment) => {
            {
              console.log(comment);
            }
            return (
              <CommentListing
                typeOfContentReplyingTo="name"
                key={comment._id}
                rootComment={comment}
                replies={replyComments}
                replyingtothisid={comment.replyingtothisid}
                sessionFromServer={sessionFromServer}
                apiLink="/api/namecomments/"
                likesApiLink="/api/namecomments/updatenamecommentlikes"
                replyingtothiscontent={name.name}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
