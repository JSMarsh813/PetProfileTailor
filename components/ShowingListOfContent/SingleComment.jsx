import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faClock } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AddComment from "../AddingNewData/AddComment";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";
import EditComment from "../EditingData/EditComment";
import DeleteButton from "../DeletingData/DeleteButton";
import DeleteContentNotification from "../DeletingData/DeleteContentNotification";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import Image from "next/image";
import ProfileImage from "../ReusableSmallComponents/ProfileImage";
import ShowTime from "./../ReusableSmallComponents/ShowTime";

function CommentListing({
  replyingtothisid,
  rootComment,
  sessionFromServer,
  typeOfContentReplyingTo,
  replyingtothiscontent,
  apilink,
  apilinklikes,
}) {
  const [replying, setReplying] = useState(false);

  const [commentParentId, setCommentParentId] = useState(null);

  const [postersName, setPostersName] = useState(rootComment.createdby.name);

  const [postersProfileImage, setPostersProfileImage] = useState(
    rootComment.createdby.profileimage,
  );

  const [postersProfileName, setProfileName] = useState(
    rootComment.createdby.profilename,
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

  let linkToShare = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${typeOfContentReplyingTo}/comment/${rootComment._id}`;

  const localLink = `/${typeOfContentReplyingTo}/comment/${rootComment._id}`;

  let linkToPost = `${
    process.env.NEXT_PUBLIC_BASE_FETCH_URL
  }${typeOfContentReplyingTo}/${
    typeOfContentReplyingTo == "name"
      ? rootComment.replyingtothiscontent
      : replyingtothisid
  }`;

  useEffect(() => {
    {
      rootComment.parentcommentid
        ? setAdjustedParentId(rootComment.parentcommentid)
        : setAdjustedParentId(rootComment._id);
    }
    //We only go one level deep. If the comment already has a parent id then we're already one level deep. So we want to set the id of this new comment as the same as this comment's parentcommendid

    //otherwise we are not one level deep/this is the first reply. So we can grab this comments id as the parentcommentid
  }, []);

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
        <ProfileImage
          divStyling="w-16"
          profileImage={postersProfileImage}
          layout="responsive"
          className="w-12 h-12 border-2 border-gray-300 rounded-full"
          width={100}
          height={100}
        />

        <div className="w-full mt-1">
          <div className="flex items-center  px-2 font-bold  text-black leading-tight">
            <a
              href={`${
                process.env.NEXT_PUBLIC_BASE_FETCH_URL
              }profile/${postersProfileName.toLowerCase()}`}
            >
              <span className="text-base">{postersName}</span>

              <span className="ml-2 text-xs font-normal text-gray-500">
                @{postersProfileName}
              </span>
            </a>

            <ShowTime
              postDate={rootComment.createdAt}
              styling="text-xs font-normal text-gray-500"
            />
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
                apiLink={apilinklikes}
                // "/api/individualbatsignalcomments/updatecommentlikes"
              />

              <ShareButton
                onClickShowShares={onClickShowShares}
                shareIconStyling="text-darkPurple"
              />
            </div>

            {sessionFromServer &&
              rootComment.createdby._id == sessionFromServer.user._id && (
                <div className="items-end flex gap-x-2">
                  <EditButton onupdateEditState={updateEditState} />
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
                apiLink={apilink}
              />
            )}

            {showDeleteConfirmation && (
              <DeleteContentNotification
                setShowDeleteConfirmation={setShowDeleteConfirmation}
                sessionFromServer={sessionFromServer}
                changeCommentState={setCommentChanged}
                commentId={rootComment._id}
                commentCreatedBy={rootComment.createdby._id}
                apiLink={apilink}
              />
            )}
          </div>
          {console.log(replyingtothiscontent)}

          {replying && (
            <AddComment
              replyingtothisid={rootComment.replyingtothisid}
              parentcommentid={adjustedParentId}
              sessionFromServer={sessionFromServer}
              apiLink={apilink}
              replyingtothiscontent={replyingtothiscontent}
            />
          )}
        </div>
      </div>
      {shareSectionShowing && (
        <section className="bg-violet-900 py-2">
          <SharingOptionsBar
            linkToShare={linkToShare}
            localLink={localLink}
          />
        </section>
      )}
      <GeneralButton
        className="flex my-4 text-base"
        onClick={() => {
          navigator.clipboard.writeText(linkToPost);
          toast.success("link saved to clipboard");
        }}
        text="link to related content"
      />
    </div>
  );
}

export default CommentListing;
