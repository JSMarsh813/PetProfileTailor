"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import LikesButtonAndLikesLogic from "@components/ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import DeleteButton from "@components/DeletingData/DeleteButton";
import EditButton from "@components/ReusableSmallComponents/buttons/EditButton";

import EditName from "../EditingData/EditName";
import ShareButton from "@components/ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import { Dialog, DialogPanel } from "@headlessui/react";
// import SeeCommentsButton from "../ReusableSmallComponents/buttons/SeeCommentsButton";
// import CommentListing from "../ShowingListOfContent/CommentListing";
// import AddComment from "../AddingNewData/AddComment";
import ProfileImage from "@components/ReusableSmallComponents/ProfileImage";
import IdeaContentSection from "../EditSuggestions/IdeaContentSection";
import ToggeableAlert from "../ReusableMediumComponents/ToggeableAlert";
import AddHashToArrayString from "@utils/stringManipulation/addHashToArrayString";

import { Ellipsis } from "lucide-react";
import ContainerForLikeShareFlag from "@components/ReusableSmallComponents/buttons/ContainerForLikeShareFlag";
import { useDeleteConfirmation } from "@hooks/useDeleteConfirmation";
import DeleteDialog from "@components/DeletingData/DeleteDialog";
import FlagDialog from "@components/Flagging/FlagDialog";
import FlagButton from "@components/Flagging/FlagButton";
import { useFlagging } from "@hooks/useFlagging";
import { useEditHandler } from "@hooks/useEditHandler";
import { useReports } from "@context/ReportsContext";
import { useCategoriesForDataType } from "@/hooks/useCategoriesForDataType";

export default function NameListingAsSections({
  dataType,
  singleContent,
  signedInUsersId,
  tagList,
  likedSetRef,
  recentLikesRef,
  mutate,
}) {
  const {
    showDeleteConfirmation,
    deleteTarget,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useDeleteConfirmation();

  const { reportsRef, hasReported, getStatus } = useReports();
  const userHasAlreadyReported = hasReported(singleContent._id.toString());

  const categoriesWithTags = useCategoriesForDataType(dataType);

  const reportStatus = getStatus(singleContent._id.toString());
  console.log("reportStatus", reportStatus);
  const reportPendingOrUndef =
    reportStatus === "pending" || reportStatus === null;
  console.log("reportPendingOrUndef", reportPendingOrUndef);

  const apiEndPoint = dataType === "name" ? "/api/names/" : "/api/description/";

  //SHARING

  const apiBaseLink = dataType === "name" ? `/api/names` : `/api/description`;

  const linkToShare =
    dataType === "name"
      ? `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/name/${singleContent.name}`
      : `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/description/${singleContent._id}`;

  const localLink =
    dataType === "name"
      ? `/name/${singleContent.name}`
      : `/description/${singleContent._id}`;

  // TODO

  const { showFlagDialog, flagTarget, openFlag, closeFlag } =
    useFlagging(reportsRef);

  const {
    showEditDialog,
    editTarget,
    openEdit,
    closeEdit,
    confirmEdit,
    isSaving,
  } = useEditHandler({
    apiEndpoint: apiEndPoint,
    mutate,
  });

  const userIsTheCreator = singleContent.createdby._id === signedInUsersId;

  let [currentTargetedId, setCurrentTargetedNameId] = useState(
    singleContent._id,
  );

  // ##### STATE FOR EDITS ####
  const [showEditPage, setShowEditPage] = useState(false);

  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  // ############# FLAG ###################
  //STATE FOR FLAG COUNT AND COLOR AND FORM

  const [userAlreadySentIdea, setUserAlreadySentIdea] = useState(
    singleContent.flaggedby != null
      ? singleContent.flaggedby.includes(signedInUsersId)
      : false,
  );
  // TODO: changed userAlreadySentIdea logic to reflect actual logic

  const [ideaFormToggled, setIdeaFormToggled] = useState(false);

  // ### for the edit notification button
  function onupdateEditState() {
    setShowEditPage(!showEditPage);
  }

  //for shares
  function onClickShowShares() {
    setShareSectionShowing(!shareSectionShowing);
  }

  console.log(
    "AddHashToArrayString(singleContent)",
    AddHashToArrayString(singleContent),
  );
  console.log("singleContent.tags", singleContent.tags);
  console.log(
    "categoriesWithTags in singleContent listings",
    categoriesWithTags,
  );
  const href = `${
    process.env.NEXT_PUBLIC_BASE_FETCH_URL
  }profile/${singleContent.createdby.profilename.toLowerCase()}`;

  return (
    <div className="text-base flex border-t border-subtleWhite mb-4">
      <ProfileImage
        divStyling="min-h-10 max-w-12 mr-4 mt-3 min-w-10 max-h-12"
        profileImage={singleContent.createdby.profileimage}
        layout="responsive"
        className="rounded-2xl"
        width={80}
        height={80}
        href={href}
      />
      <div className="flex-grow ">
        <div
          className="grid  grid-cols-1
         space-between flex-none     
                
           
         
            bg-primary
                    text-subtleWhite sm:p-2 
                  justify-items-center "
          //  items-center
        >
          {/* ###### CREATEDBY SECTION #### */}
          <section className="w-full pt-2 ">
            {/* height needed otherwise the nonpositioned elements will move up */}

            <div className="">
              <div className="w-full flex flex-wrap items-center justify-between p-2">
                <a
                  href={`${
                    process.env.NEXT_PUBLIC_BASE_FETCH_URL
                  }profile/${singleContent.createdby.profilename.toLowerCase()}`}
                  className="flex"
                >
                  <div className="flex flex-wrap">
                    <span className="font-bold text-lg mr-2">
                      {singleContent.createdby.name}
                    </span>
                    <span className="font-thin text-base">
                      @{singleContent.createdby.profilename}
                    </span>
                  </div>
                </a>

                <Menu
                  as="div"
                  className="relative inline-block text-left"
                >
                  {({ open }) => (
                    <>
                      <div>
                        <MenuButton
                          className={`px-2 py-1 rounded ${
                            open
                              ? " bg-subtleWhite text-secondary rounded-2xl"
                              : "hover:bg-blue-400 rounded-2xl"
                          }`}
                        >
                          <Ellipsis />
                        </MenuButton>
                      </div>

                      <MenuItems className="absolute right-0 mt-2 w-48 py-3 origin-top-right bg-secondary border text-subtleWhite border-subtleWhite rounded-md shadow-lg focus:outline-none z-50">
                        {signedInUsersId &&
                        singleContent.createdby._id == signedInUsersId ? (
                          <MenuItem>
                            {() => (
                              <DeleteButton
                                content={singleContent}
                                onDeleteClick={openDelete}
                              />
                            )}
                          </MenuItem>
                        ) : (
                          <MenuItem>
                            {({ active }) => (
                              <FlagButton
                                content={singleContent}
                                onClick={openFlag}
                                userIsTheCreator={
                                  singleContent.createdby._id ===
                                  signedInUsersId
                                }
                              />
                            )}
                          </MenuItem>
                        )}
                      </MenuItems>
                    </>
                  )}
                </Menu>
              </div>
            </div>

            {/* Dialog rendered outside, it can't be placed in  <DeleteButton> in the MenuItem because headlessUi's menu will closed anything inside it when one of its button is clicked
            so the deletion confirmation dialog has to be outside of it, so it isn't immeditely sent to the abyss */}
            {showDeleteConfirmation && deleteTarget && (
              <DeleteDialog
                open={showDeleteConfirmation}
                target={deleteTarget}
                onClose={closeDelete}
                signedInUsersId={signedInUsersId}
                onConfirm={
                  () => confirmDelete(apiBaseLink, signedInUsersId, mutate) // passing mutate from useSwrPagination
                }
              />
            )}

            {!userIsTheCreator && reportPendingOrUndef && showFlagDialog && (
              <FlagDialog
                open={showFlagDialog}
                target={flagTarget}
                onClose={closeFlag}
                signedInUsersId={signedInUsersId}
                contentId={singleContent._id}
              />
            )}

            {showEditDialog && editTarget && (
              <EditName
                open={showEditDialog}
                onClose={closeEdit}
                name={editTarget}
                tagList={tagList}
                categoriesWithTags={categoriesWithTags}
                onSave={confirmEdit}
                signedInUsersId={signedInUsersId}
              />
            )}
          </section>

          <span className="font-bold text-xl text-center block w-full mb-2">
            {singleContent.name}{" "}
          </span>

          {/* ###### DESCRIPTION SECTION #### */}

          <p className="whitespace-pre-line">
            {singleContent.description && singleContent.description}
          </p>

          {/* ###### TAGS SECTION #### */}
          <span className="my-4"> {AddHashToArrayString(singleContent)} </span>

          {/* ###### LIKES, SHARE, FLAG #### */}

          <div className="w-full flex justify-evenly m-2 ">
            <LikesButtonAndLikesLogic
              data={singleContent}
              HeartIconStyling="text-xl ml-2 my-auto mx-auto"
              HeartIconTextStyling="mx-2"
              currentTargetedId={currentTargetedId}
              signedInUsersId={signedInUsersId}
              apiBaseLink={apiBaseLink}
              likedSetRef={likedSetRef}
              recentLikesRef={recentLikesRef}
            />

            <ShareButton onClickShowShares={onClickShowShares} />

            {singleContent && singleContent.createdby._id == signedInUsersId ? (
              <ContainerForLikeShareFlag>
                <EditButton
                  onupdateEditState={() => {
                    if (singleContent) openEdit(singleContent);
                  }}
                />
              </ContainerForLikeShareFlag>
            ) : (
              <IdeaContentSection
                userIsTheCreator={userIsTheCreator}
                signedInUsersId={signedInUsersId}
                currentTargetedId={currentTargetedId}
                contentType="name"
                content={singleContent}
                apiIdeaSubmission="/api/_______/"
                apiaddUserToIdea="/api/_____"
                userAlreadySentIdea={userAlreadySentIdea}
                setUserAlreadySentIdea={setUserAlreadySentIdea}
                ideaFormToggled={ideaFormToggled}
                setIdeaFormToggled={setIdeaFormToggled}
                categoriesWithTags={categoriesWithTags}
              />

              // <FlaggingContentSection
              //   userIsTheCreator={userIsTheCreator}
              //   signedInUsersId={signedInUsersId}
              //   currentTargetedId={currentTargetedId}
              //   contentType="name"
              //   content={name}
              //   apiflagReportSubmission="/api/flag/flagreportsubmission/"
              //   apiaddUserToFlaggedByArray="/api/flag/addToNamesFlaggedByArray/"
              // />
            )}
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

        {ideaFormToggled && userIsTheCreator && (
          <ToggeableAlert
            text="You cannot flag your own content 😜"
            setToggleState={setIdeaFormToggled}
            toggleState={ideaFormToggled}
          />
        )}

        {ideaFormToggled && userAlreadySentIdea && (
          <ToggeableAlert
            text="We are in the process of reviewing your idea. Please wait for the prior report to be reviewed before submitting"
            setToggleState={setIdeaFormToggled}
            toggleState={ideaFormToggled}
          />
        )}
      </div>
    </div>
  );
}
