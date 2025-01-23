import React, { useState, useEffect } from "react";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import FlagButtonAndLogic from "../ReusableSmallComponents/buttons/FlagButtonAndLogic";
import DeleteButton from "../ReusableSmallComponents/buttons/DeleteButton";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";
import DeleteItemNotification from "../DeletingData/DeleteItemNotification";
import EditName from "../EditingData/EditName";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import SeeCommentsButton from "../ReusableSmallComponents/buttons/SeeCommentsButton";
import CommentListing from "../ShowingListOfContent/CommentListing";
import AddComment from "../AddingNewData/AddComment";
import ProfileImage from "../ReusableSmallComponents/ProfileImage";
import FormFlagReport from "../AddingNewData/FormFlagReport";
import ToggeableAlert from "../ReusableMediumComponents/ToggeableAlert";

export default function NameListingAsSections({
  name,
  sessionFromServer,
  tagList,
  setNameEditedFunction,
}) {
  let userIsTheCreator = name.createdby._id === sessionFromServer.user.id;

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

  //STATE FOR FLAG COUNT AND COLOR AND FORM

  const [flaggedCount, setFlaggedCount] = useState(name.flaggedby.length);

  const [userHasAlreadyReportedThis, setUserHasAlreadyReportedThis] = useState(
    name.flaggedby.includes(sessionFromServer.user.id),
  );

  //flagIconClickedByNewUser:
  // the only user that can toggle the report flag because they are
  // 1. not the content's creator
  // 2. haven't successfully submitted a report
  const [flagIconClickedByNewUser, setFlagIconClickedByNewUser] = useState(
    userHasAlreadyReportedThis,
  );

  const [flagFormIsToggled, setFlagFormIsToggled] = useState(false);

  //SHARING

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

          {sessionFromServer &&
            name.createdby._id == sessionFromServer.user.id && (
              <div className="my-2 flex w-full justify-around ">
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

        <div className="w-full bg-violet-900 flex justify-center">
          <FlagButtonAndLogic
            data={name}
            FlagIconStyling="text-3xl my-auto mx-auto pt-4"
            FlagIconTextStyling="ml-2 inline-block pb-4"
            currentTargetedId={currentTargetedId}
            session={sessionFromServer}
            flagFormIsToggled={flagFormIsToggled}
            setFlagFormIsToggled={setFlagFormIsToggled}
            flaggedCount={flaggedCount}
            setFlaggedCount={setFlaggedCount}
            flagIconClickedByNewUser={flagIconClickedByNewUser}
            setFlagIconClickedByNewUser={setFlagIconClickedByNewUser}
            userHasAlreadyReportedThis={userHasAlreadyReportedThis}
            userIsTheCreator={userIsTheCreator}
          />
        </div>
      </div>
      {/* ###### END OF LISTING #### */}

      {/* ###### TOGGLES SECTION, pops up underneath listing #### */}

      {flagFormIsToggled && userIsTheCreator && (
        <ToggeableAlert
          text="You cannot flag your own content 😜"
          setToggleState={setFlagFormIsToggled}
          toggleState={flagFormIsToggled}
        />
      )}

      {flagFormIsToggled && userHasAlreadyReportedThis && (
        <ToggeableAlert
          text="We are in the process of reviewing your report. This content cannot be
          flagged again until the prior report is reviewed"
          setToggleState={setFlagFormIsToggled}
          toggleState={flagFormIsToggled}
        />
      )}

      {!userIsTheCreator &&
        !userHasAlreadyReportedThis &&
        flagFormIsToggled && (
          <FormFlagReport
            contentType="name"
            contentInfo={name}
            flaggedByUser={sessionFromServer.user.id}
            setFlagFormIsToggled={setFlagFormIsToggled}
            flagFormIsToggled={flagFormIsToggled}
            setFlaggedCount={setFlaggedCount}
            flaggedCount={flaggedCount}
            apiflagReportSubmission="/api/flag/flagreportsubmission/"
            setFlagIconClickedByNewUser={setFlagIconClickedByNewUser}
            apiaddUserToFlaggedByArray="/api/flag/addToNamesFlaggedByArray/"
            setUserHasAlreadyReportedThis={setUserHasAlreadyReportedThis}
          />
        )}

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
