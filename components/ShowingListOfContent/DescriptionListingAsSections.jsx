import React, { useState, useEffect } from "react";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import DeleteButton from "../DeletingData/DeleteButton";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";
import { useRouter } from "next/router";

import EditDescription from "../EditingData/EditDescription";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";

import Image from "next/image";
import ProfileImage from "../ReusableSmallComponents/ProfileImage";
import FlaggingContentSection from "../Flagging/FlaggingContentSection";

export default function DescriptionListingAsSections({
  description,
  signedInUsersId,
  tagList,
  className,
  setItemEditedFunction,
  setDeleteThisContentId,
}) {
  let contentCreatedBy = description.createdby._id;
  let userIsTheCreator = contentCreatedBy === signedInUsersId;

  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  const linkToShare = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/description/${description._id}`;
  const localLink = `/description/${description._id}`;

  const router = useRouter();

  //############## STATE FOR LIKES #######

  let [currentTargetedId, setCurrentTargetedDescriptionId] = useState(
    description._id,
  );

  //##### STATE FOR DELETIONS ######

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // ##### STATE FOR EDITS ####
  const [showEditPage, SetShowEditPage] = useState(false);

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

  //if itemChanged in the state is true, then we'll force a reload of the page. This is for BOTH the edit and delete functions

  return (
    <div
      className={`border-b-2 border-amber-300 text-white px-6 w-full ${className}`}
    >
      {/* ###### DESCRIPTION SECTION #### */}

      <p className="whitespace-pre-line mt-2">
        <span className="text-amber-200 font-bold">Description: </span>
        {description.description}
      </p>

      {/* ###### NOTES SECTION #### */}
      <p className="whitespace-pre-wrap break-all">
        <span className="text-amber-200 font-bold">notes: </span>
        {description.notes == "" ? "no notes" : description.notes}
      </p>

      <div
        className="grid
            grid-cols-1  xl:grid-cols-4 gap-4 text-base
            place-items-center
            bg-violet-900 border-2 border-yellow-200
                    text-purple-200 p-2  
                    my-4 "
      >
        {/* ###### LIKES SECTION #### */}

        <LikesButtonAndLikesLogic
          data={description}
          HeartIconStyling="text-2xl"
          HeartIconTextStyling="ml-2"
          currentTargetedId={currentTargetedId}
          signedInUsersId={signedInUsersId}
          apiLink="/api/description/updateLikes"
        />

        {/* ###### TAGS SECTION #### */}
        <span className="text-amber-100 font-bold">Tags: </span>
        <p className="">{description.tags.map((tag) => tag.tag).join(",  ")}</p>

        <div className="text-center">
          <ShareButton onClickShowShares={onClickShowShares} />

          {signedInUsersId && description.createdby._id == signedInUsersId && (
            <div className="grid grid-cols-2">
              <EditButton
                className="ml-2 mr-6"
                onupdateEditState={updateEditState}
              />
              <DeleteButton
                signedInUsersId={signedInUsersId}
                contentId={description._id}
                setDeleteThisContentId={setDeleteThisContentId}
                contentCreatedBy={contentCreatedBy}
                apiLink="/api/description/"
              />
            </div>
          )}
        </div>

        {/* ###### CREATEDBY SECTION #### */}

        <section className="flex gap-1.5 place-items-center  bg-violet-700 p-4 border-2 border-amber-200 border-dotted ">
          <span className="text-amber-200 font-bold">Shared by: </span>

          <ProfileImage
            divStyling="w-12 mr-2"
            profileImage={description.createdby.profileimage}
            layout="responsive"
            className="rounded-2xl h-16 inline"
            width={80}
            height={80}
          />

          <a
            className=""
            href={`${
              process.env.NEXT_PUBLIC_BASE_FETCH_URL
            }profile/${description.createdby.profilename.toLowerCase()}`}
          >
            <div className="inline flex flex-col text-amber-100">
              <span className=""> {description.createdby.name}</span>
              <span className="">@{description.createdby.profilename}</span>
            </div>
          </a>

          {showEditPage && (
            <EditDescription
              SetShowEditPage={SetShowEditPage}
              description={description}
              signedInUsersId={signedInUsersId}
              tagList={tagList}
              setEditedFunction={setItemEditedFunction}
            />
          )}
        </section>

        <div>
          <span className="text-amber-200 font-bold">Related Names: </span>
          {description.relatednames
            .map((relatedname) => relatedname)
            .join(", ")}
        </div>

        <div className="w-full bg-violet-900 flex justify-center">
          <FlaggingContentSection
            userIsTheCreator={userIsTheCreator}
            signedInUsersId={signedInUsersId}
            currentTargetedId={currentTargetedId}
            contentType="description"
            content={description}
            apiflagReportSubmission="/api/flag/flagreportsubmission/"
            apiaddUserToFlaggedByArray="/api/flag/addToDescriptionsFlaggedByArray/"
          />
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
    </div>
  );
}
