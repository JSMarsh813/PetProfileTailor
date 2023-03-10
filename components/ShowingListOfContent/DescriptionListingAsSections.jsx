import React, { useState, useEffect } from "react";
import axios from "axios";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import DeleteButton from "../ReusableSmallComponents/buttons/DeleteButton";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";
import { useRouter } from "next/router";
import DeleteItemNotification from "../DeletingData/DeleteItemNotification";
import EditDescription from "../EditingData/EditDescription";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";

import Link from "next/Link";

export default function DescriptionListingAsSections({
  description,
  sessionFromServer,
  tagList,
  nameList,
}) {
  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  let linkToShare = `http://localhost:3000/description/${description._id}`;

  const router = useRouter();

  //############## STATE FOR LIKES #######

  let [currentTargetedId, setCurrentTargetedDescriptionId] = useState(
    description._id
  );

  //##### STATE FOR DELETIONS ######

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // ##### STATE FOR EDITS ####
  const [showEditPage, SetShowEditPage] = useState(false);

  //#### STATE FOR EDITS AND DELETIONS
  const [itemChanged, setItemChanged] = useState(false);

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

  if (itemChanged) {
    const forceReload = () => {
      router.reload();
    };

    forceReload();
    setItemChanged(false);
  }

  return (
    <div className=" border-b-2 border-amber-300 text-white px-6 w-screen">
      {/* ###### description SECTION #### */}
      <div className="whitespace-pre-line mt-2">
        <span className="text-amber-200 font-bold">Description: </span>
        {description.description}{" "}
      </div>

      {/* ###### NOTES SECTION #### */}
      <p className="whitespace-pre-line mt-4">
        <span className="text-amber-200 font-bold">Notes: </span>
        {description.notes == "" ? "no notes" : description.notes}
      </p>
      <div
        className="grid 
            grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 text-base
            place-items-center
            bg-violet-900 border-2 border-yellow-200
                    text-purple-200 p-2  
                    my-4                
                    
                   "
      >
        {/* ###### LIKES SECTION #### */}

        <LikesButtonAndLikesLogic
          data={description}
          HeartIconStyling="text-2xl"
          HeartIconTextStyling="ml-2"
          currentTargetedId={currentTargetedId}
          session={sessionFromServer}
          apiLink="/api/description/updateLikes"
        />

        {/* ###### TAGS SECTION #### */}
        <p>
          <span className="text-amber-200 font-bold">Tags: </span>

          {description.tags.map((tag) => tag.tag).join(", ")}
        </p>

        <div className="text-center">
          <ShareButton onClickShowShares={onClickShowShares} />

          {sessionFromServer &&
            description.createdby._id == sessionFromServer.user._id && (
              <div className="grid grid-cols-2">
                <EditButton
                  className="ml-2 mr-6"
                  setShowEditPage={updateEditState}
                />
                <DeleteButton onupdateDeleteState={updateDeleteState} />
              </div>
            )}
        </div>

        {/* ###### CREATEDBY SECTION #### */}

        <section className="flex gap-1.5 place-items-center lg:ml-10 bg-violet-700 p-4 border-2 border-amber-200 border-dotted">
          <span className="text-amber-200 font-bold">Shared by: </span>

          <img
            src={description.createdby.profileimage}
            className="rounded-2xl h-16 inline"
          />
          <a
            className=""
            href={`http://localhost:3000/profile/${description.createdby.profilename.toLowerCase()}`}
          >
            <div className="inline flex flex-col">
              <span className=""> {description.createdby.name}</span>
              <span className="">@{description.createdby.profilename}</span>
            </div>
          </a>

          {showDeleteConfirmation && (
            <DeleteItemNotification
              setShowDeleteConfirmation={setShowDeleteConfirmation}
              sessionFromServer={sessionFromServer}
              changeItemState={setItemChanged}
              itemId={description._id}
              itemCreatedBy={description.createdby._id}
              deletionApiPath="/api/description/"
            />
          )}

          {showEditPage && (
            <EditDescription
              SetShowEditPage={SetShowEditPage}
              description={description}
              sessionFromServer={sessionFromServer}
              setItemChanged={setItemChanged}
              tagList={tagList}
              nameList={nameList}
            />
          )}
        </section>

        <div>
          <span className="text-amber-200 font-bold">Related Names: </span>
          {description.relatednames
            .map((relatedname) => relatedname)
            .join(", ")}
        </div>
      </div>

      {shareSectionShowing && (
        <section className="bg-violet-900 py-2">
          <SharingOptionsBar linkToShare={linkToShare} />
        </section>
      )}
    </div>
  );
}
