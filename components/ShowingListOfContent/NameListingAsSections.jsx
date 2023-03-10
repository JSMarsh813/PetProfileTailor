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

export default function NameListingAsSections({
  name,
  sessionFromServer,
  tagList,
}) {
  const router = useRouter();

  //############## STATE FOR LIKES #######

  let [currentTargetedId, setCurrentTargetedNameId] = useState(name._id);

  //##### STATE FOR DELETIONS ######

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // ##### STATE FOR EDITS ####
  const [showEditPage, SetShowEditPage] = useState(false);

  // console.log(`this is showEditPage ${showEditPage}`);

  //#### STATE FOR EDITS AND DELETIONS
  const [itemChanged, setItemChanged] = useState(false);

  //### STATE FOR COMMENTS ######
  const [commentsShowing, SetCommentsShowing] = useState(false);

  const [commentsFromFetch, setCommentsFromFetch] = useState([]);

  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  let linkToShare = `${process.env.BASE_FETCH_URL}/name/${name.name}`;

  // ##for the delete notification button #####

  function updateDeleteState() {
    setShowDeleteConfirmation(true);
  }

  // ### for the edit notification button
  function updateEditState() {
    SetShowEditPage(true);
  }

  //for shares
  function onClickShowShares() {
    setShareSectionShowing(!shareSectionShowing);
  }

  //########## for comments
  function updateCommentShowState() {
    SetCommentsShowing(!commentsShowing);
  }

  const handleFetchComments = async () => {
    const response = await fetch(
      "/api/names/commentscontainingnameid/" + name._id
    );
    const data = await response.json();
    // console.log(data);
    setCommentsFromFetch(data);
  };

  useEffect(() => {
    handleFetchComments();
    // console.log(commentsFromFetch);
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

  //if itemChanged in the state is true, then we'll force a reload of the page. This is for BOTH the edit and delete functions

  if (itemChanged) {
    const forceReload = () => {
      router.reload();
    };

    forceReload();
    setItemChanged(false);
  }

  return (
    <div className="text-base">
      <div
        className="grid 
            lg:grid-cols-5
            grid-cols-3 gap-4 
            border-b-2 border-amber-300
            bg-darkPurple
                    text-purple-200 p-2  
                    
                    
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
            onupdateCommentShowState={updateCommentShowState}
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
            href={`http://localhost:3000/profile/${name.createdby.profilename.toLowerCase()}`}
          >
            <img
              src={name.createdby.profileimage}
              className="rounded-2xl h-16"
            />

            <span> {name.createdby.name}</span>
            <span> @{name.createdby.profilename}</span>
          </a>

          {sessionFromServer &&
            name.createdby._id == sessionFromServer.user._id && (
              <div className="my-2">
                <EditButton
                  className="ml-2 mr-6"
                  setShowEditPage={updateEditState}
                />
                <DeleteButton onupdateDeleteState={updateDeleteState} />
              </div>
            )}

          {showDeleteConfirmation && (
            <DeleteItemNotification
              setShowDeleteConfirmation={setShowDeleteConfirmation}
              sessionFromServer={sessionFromServer}
              changeItemState={setItemChanged}
              itemId={name._id}
              itemCreatedBy={name.createdby._id}
              deletionApiPath="/api/names/"
            />
          )}

          {showEditPage && (
            <EditName
              SetShowEditPage={SetShowEditPage}
              name={name}
              sessionFromServer={sessionFromServer}
              setItemChanged={setItemChanged}
              tagList={tagList}
            />
          )}
        </section>
      </div>

      {shareSectionShowing && (
        <section className="bg-violet-900 py-2">
          <SharingOptionsBar linkToShare={linkToShare} />
        </section>
      )}

      {commentsShowing && (
        <section className="bg-violet-900 py-2">
          <AddComment
            apiLink="/api/namecomments/"
            replyingtothisid={name._id}
            hasParent={null}
            sessionFromServer={sessionFromServer}
          />
          {/* ######### showing comments #########*/}

          {rootComments.map((comment) => {
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
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
