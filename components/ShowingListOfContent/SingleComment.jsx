import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faClock } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AddComment from "../AddingNewData/AddComment";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";
import EditComment from "../EditingData/EditComment";
import DeleteButton from "../ReusableSmallComponents/buttons/DeleteButton";
import DeleteCommentNotification from "../DeletingData/DeleteCommentNotification";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";

function CommentListing({
  replyingtothisid,
  rootComment,
  sessionFromServer,
  typeOfContentReplyingTo,
}) {
  const [replying, setReplying] = useState(false);

  const [commentParentId, setCommentParentId] = useState(null);

  const [postersName, setPostersName] = useState(rootComment.createdby.name);

  const [postersProfileImage, setPostersProfileImage] = useState(
    rootComment.createdby.profileimage
  );

  const [postersProfileName, setProfileName] = useState(
    rootComment.createdby.profilename
  );

  const [adjustedParentId, setAdjustedParentId] = useState("");

  //for editing
  const [showEditPage, SetShowEditPage] = useState(false);

  //for deleting
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  //setting up that we will reroute/refresh if the comment is changed
  const router = useRouter();
  const [commentChanged, setCommentChanged] = useState(false);

  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  let linkToShare = `http://localhost:3000/${typeOfContentReplyingTo}/comment/${rootComment._id}`;
  let apiLink = "http://localhost:3000/api/individualbatsignalcomments";

  console.log(typeOfContentReplyingTo);
  let linkToPost = `http://localhost:3000/${typeOfContentReplyingTo}/${rootComment.replyingtothisid}`;

  useEffect(() => {
    {
      rootComment.parentcommentid
        ? setAdjustedParentId(rootComment.parentcommentid)
        : setAdjustedParentId(rootComment._id);
    }
    //We only go one level deep. If the comment already has a parent id then we're already one level deep. So we want to set the id of this new comment as the same as this comment's parentcommendid

    //otherwise we are not one level deep/this is the first reply. So we can grab this comments id as the parentcommentid
  }, []);

  //  #########   FORMATTING DATE  #################
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  let formattedPostDate = dateFormatter.format(
    Date.parse(rootComment.createdAt)
  );

  function updateEditState() {
    SetShowEditPage(true);
  }

  function updateDeleteState() {
    setShowDeleteConfirmation(true);
  }

  //if postEdited in the state is true, then we'll force a reload of the page
  if (commentChanged) {
    const forceReload = () => {
      router.reload();
    };

    forceReload();
    setCommentChanged(false);
  }
  //for shares
  function onClickShowShares() {
    setShareSectionShowing(!shareSectionShowing);
  }

  return (
    <div
      className={`flex-col mx-auto py-2 pr-4
               bg-darkPurple 
                border-2 border-violet-300}`}
    >
      <div className="flex flex-row bg-violet-50 p-2 ml-6 ">
        <img
          className="w-12 h-12 border-2 border-gray-300 rounded-full"
          alt="poster's avatar"
          src={postersProfileImage}
        />

        <div className="w-full mt-1">
          <div className="flex items-center  px-2 font-bold  text-black leading-tight">
            <a
              href={`http://localhost:3000/profile/${postersProfileName.toLowerCase()}`}
            >
              <span className="text-base">{postersName}</span>

              <span className="ml-2 text-xs font-normal text-gray-500">
                @{postersProfileName}
              </span>
            </a>

            <span className="mt-2 ml-2 text-xs font-normal text-gray-500">
              <FontAwesomeIcon
                icon={faClock}
                className="mx-2"
              ></FontAwesomeIcon>
              {formattedPostDate}
            </span>
          </div>

          <p className=" px-2 ml-2 text-sm font-medium leading-loose text-gray-600 text-left">
            {rootComment.description}
          </p>

          <div className="flex justify-between">
            {/* div with reply and heart icons */}
            <div className="text-left ml-2 mt-2 items-start flex">
              <FontAwesomeIcon
                icon={faCommentDots}
                className="mx-2 text-darkPurple text-xl"
                onClick={() => {
                  setReplying(!replying);
                }}
              ></FontAwesomeIcon>
              <LikesButtonAndLikesLogic
                data={rootComment}
                HeartIconStyling="text-xl"
                HeartIconTextStyling="text-darkPurple ml-2"
                session={sessionFromServer}
                apiLink={`http://localhost:3000/api/individualbatsignalcomments/updatecommentlikes`}
              />

              <ShareButton
                onClickShowShares={onClickShowShares}
                shareIconStyling="text-darkPurple"
              />
            </div>

            {sessionFromServer &&
              rootComment.createdby._id == sessionFromServer.user._id && (
                <div className="items-end flex gap-x-2">
                  <EditButton setShowEditPage={updateEditState} />
                  <DeleteButton onupdateDeleteState={updateDeleteState} />
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

            {showDeleteConfirmation && (
              <DeleteCommentNotification
                setShowDeleteConfirmation={setShowDeleteConfirmation}
                sessionFromServer={sessionFromServer}
                changeCommentState={setCommentChanged}
                commentId={rootComment._id}
                commentCreatedBy={rootComment.createdby._id}
                apiLink={apiLink}
              />
            )}
          </div>

          {replying && (
            <AddComment
              replyingtothisid={rootComment.replyingtothisid}
              parentcommentid={adjustedParentId}
              sessionFromServer={sessionFromServer}
              apiLink={apiLink}
            />
          )}
        </div>
      </div>
      {shareSectionShowing && (
        <section className="bg-violet-900 py-2">
          <SharingOptionsBar linkToShare={linkToShare} />
        </section>
      )}
      <GeneralButton
        className="flex my-4 text-base"
        onClick={() => {
          navigator.clipboard.writeText(linkToPost);
          toast.success("link saved to clipboard");
        }}
        text="link to related post"
      />
    </div>
  );
}

export default CommentListing;
