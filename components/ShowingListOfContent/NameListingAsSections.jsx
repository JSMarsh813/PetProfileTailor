import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import LikesButtonAndLikesLogic from "../ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import FlagButtonAndLogic from "../Flagging/FlagButton";
import DeleteButton from "../DeletingData/DeleteButton";
import EditButton from "../ReusableSmallComponents/buttons/EditButton";

import EditName from "../EditingData/EditName";
import ShareButton from "../ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";
import { Dialog, DialogPanel } from "@headlessui/react";
// import SeeCommentsButton from "../ReusableSmallComponents/buttons/SeeCommentsButton";
// import CommentListing from "../ShowingListOfContent/CommentListing";
// import AddComment from "../AddingNewData/AddComment";
import ProfileImage from "../ReusableSmallComponents/ProfileImage";
import FormFlagReport from "../Flagging/FormFlagReport";
import IdeaContentSection from "../ContentEditSuggestions/IdeaContentSection";
import ToggeableAlert from "../ReusableMediumComponents/ToggeableAlert";
import FlaggingContentSection from "../Flagging/FlaggingContentSection";
import AddHashToArrayString from "../../utils/stringManipulation/addHashToArrayString";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Ellipsis } from "lucide-react";
import ContainerForLikeShareFlag from "../ReusableSmallComponents/buttons/ContainerForLikeShareFlag";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import DeleteDialog from "../DeletingData/DeleteDialog";
import FlagDialog from "../Flagging/FlagDialog";
import FlagButton from "../Flagging/FlagButton";
import { useFlagging } from "../../hooks/useFlagging";

export default function NameListingAsSections({
  name,
  signedInUsersId,
  tagList,
  setNameEditedFunction,
  likedSetRef,
  recentLikesRef,
  categoriesWithTags,
  mutate,
}) {
  const {
    showDeleteConfirmation,
    deleteTarget,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useDeleteConfirmation();

  const { showFlagDialog, flagTarget, openFlag, closeFlag } = useFlagging();

  const userIsTheCreator = name.createdby._id === signedInUsersId;
  const userHasAlreadyReported =
    flagTarget?.flaggedby?.includes(signedInUsersId) ?? false;

  let [currentTargetedId, setCurrentTargetedNameId] = useState(name._id);

  // ##### STATE FOR EDITS ####
  const [showEditPage, setShowEditPage] = useState(false);

  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  //SHARING

  const linkToShare = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/name/${name.name}`;
  const localLink = `/name/${name.name}`;

  // ############# FLAG ###################
  //STATE FOR FLAG COUNT AND COLOR AND FORM

  const [userAlreadySentIdea, setUserAlreadySentIdea] = useState(
    name.flaggedby != null ? name.flaggedby.includes(signedInUsersId) : false,
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

  console.log("AddHashToArrayString(name)", AddHashToArrayString(name));
  console.log("name.tags", name.tags);
  console.log("categoriesWithTags in name listings", categoriesWithTags);

  return (
    <div className="text-base flex border-t border-subtleWhite mb-4">
      <a
        href={`${
          process.env.NEXT_PUBLIC_BASE_FETCH_URL
        }profile/${name.createdby.profilename.toLowerCase()}`}
      >
        <ProfileImage
          divStyling="min-h-10 max-w-12 mr-4 mt-3 min-w-10 max-h-12"
          profileImage={name.createdby.profileimage}
          layout="responsive"
          className="rounded-2xl"
          width={80}
          height={80}
        />
      </a>
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
                  }profile/${name.createdby.profilename.toLowerCase()}`}
                  className="flex"
                >
                  <div className="flex flex-wrap">
                    <span className="font-bold text-lg mr-2">
                      {name.createdby.name}
                    </span>
                    <span className="font-thin text-base">
                      @{name.createdby.profilename}
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
                        name.createdby._id == signedInUsersId ? (
                          <MenuItem>
                            {() => (
                              <DeleteButton
                                content={name}
                                onDeleteClick={openDelete}
                              />
                            )}
                          </MenuItem>
                        ) : (
                          <MenuItem>
                            {({ active }) => (
                              <FlagButton
                                content={name}
                                onClick={openFlag}
                                userHasAlreadyReported={name.flaggedby?.includes(
                                  signedInUsersId,
                                )}
                                userIsTheCreator={
                                  name.createdby._id === signedInUsersId
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
                  () => confirmDelete("/api/names/", signedInUsersId, mutate) // passing mutate from useSwrPagination
                }
              />
            )}

            {!userIsTheCreator && !userHasAlreadyReported && showFlagDialog && (
              <FlagDialog
                open={showFlagDialog}
                target={flagTarget}
                onClose={closeFlag}
                signedInUsersId={signedInUsersId}
              />
            )}

            {showEditPage && (
              <EditName
                SetShowEditPage={setShowEditPage}
                name={name}
                signedInUsersId={signedInUsersId}
                tagList={tagList}
                setEditedFunction={setNameEditedFunction}
                categoriesWithTags={categoriesWithTags}
              />
            )}
          </section>

          <span className="font-bold text-xl text-center block w-full mb-2">
            {name.name}{" "}
          </span>

          {/* ###### DESCRIPTION SECTION #### */}

          <p className="whitespace-pre-line">
            {name.description && name.description}
          </p>

          {/* ###### TAGS SECTION #### */}
          <span className="my-4"> {AddHashToArrayString(name)} </span>

          {/* ###### LIKES, SHARE, FLAG #### */}

          <div className="w-full flex justify-evenly m-2 ">
            <LikesButtonAndLikesLogic
              data={name}
              HeartIconStyling="text-xl ml-2 my-auto mx-auto"
              HeartIconTextStyling="mx-2"
              currentTargetedId={currentTargetedId}
              signedInUsersId={signedInUsersId}
              apiBaseLink={`/api/names`}
              likedSetRef={likedSetRef}
              recentLikesRef={recentLikesRef}
            />

            <ShareButton onClickShowShares={onClickShowShares} />

            {signedInUsersId && name.createdby._id == signedInUsersId ? (
              <ContainerForLikeShareFlag>
                <EditButton
                  className=""
                  onupdateEditState={onupdateEditState}
                />
              </ContainerForLikeShareFlag>
            ) : (
              <IdeaContentSection
                userIsTheCreator={userIsTheCreator}
                signedInUsersId={signedInUsersId}
                currentTargetedId={currentTargetedId}
                contentType="name"
                content={name}
                apiIdeaSubmission="/api/_______/"
                apiaddUserToIdea="/api/_____"
                userAlreadySentIdea={userAlreadySentIdea}
                setUserAlreadySentIdea={setUserAlreadySentIdea}
                ideaFormToggled={ideaFormToggled}
                setIdeaFormToggled={setIdeaFormToggled}
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
