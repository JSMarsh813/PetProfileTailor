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
  console.log(`show edit page ${showEditPage}`);
  //#### STATE FOR EDITS AND DELETIONS
  const [itemChanged, setItemChanged] = useState(false);

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

  //if itemChanged in the state is true, then we'll force a reload of the page. This is for BOTH the edit and delete functions

  if (itemChanged) {
    const forceReload = () => {
      router.reload();
    };

    forceReload();
    setItemChanged(false);
  }

  return (
    <div className=" border-b-2 border-amber-300">
      <div
        className="grid 
            lg:grid-cols-5
            grid-cols-3 gap-4 text-base
           
            bg-darkPurple
                    text-purple-200 p-2  
                    
                    
                    items-center justify-items-center"
      >
        {/* ###### LIKES SECTION #### */}
        <div>
          <LikesButtonAndLikesLogic
            data={description}
            HeartIconStyling="text-2xl"
            HeartIconTextStyling="ml-2"
            currentTargetedId={currentTargetedId}
            session={sessionFromServer}
            apiLink={`http://localhost:3000/api/description/updateLikes`}
          />

          <ShareButton onClickShowShares={onClickShowShares} />
        </div>
        {/* ###### description SECTION #### */}
        <span className=""> {description.description} </span>

        {/* ###### NOTES SECTION #### */}
        <span className="ml-4">
          {description.notes == "" ? "no notes" : description.notes}
        </span>

        {/* ###### TAGS SECTION #### */}
        <span>
          {description.tags.map((descriptions) => descriptions).join(", ")}
        </span>

        {/* ###### CREATEDBY SECTION #### */}

        <section>
          <a
            href={`http://localhost:3000/profile/${description.createdby.profilename.toLowerCase()}`}
          >
            <img
              src={description.createdby.profileimage}
              className="rounded-2xl h-16"
            />

            <span> {description.createdby.name}</span>
            <span> @{description.createdby.profilename}</span>
          </a>
          {sessionFromServer &&
            description.createdby._id == sessionFromServer.user._id && (
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
              // setToastMessage={setToastMessage}
            />
          )}
        </section>
      </div>

      {shareSectionShowing && (
        <section className="bg-violet-900 py-2">
          <SharingOptionsBar linkToShare={linkToShare} />
        </section>
      )}
    </div>
  );
}
