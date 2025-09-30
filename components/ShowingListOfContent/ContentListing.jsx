"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import LikesButtonAndLikesLogic from "@components/ReusableSmallComponents/buttons/LikesButtonAndLikesLogic";
import DeleteButton from "@components/DeletingData/DeleteButton";
import EditButton from "@components/ReusableSmallComponents/buttons/EditButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import EditContent from "../EditingData/EditContent";
import ShareButton from "@components/ReusableSmallComponents/buttons/ShareButton";
import SharingOptionsBar from "../ReusableMediumComponents/SharingOptionsBar";

import ProfileImage from "@components/ReusableSmallComponents/ProfileImage";
import ToggeableAlert from "../ReusableMediumComponents/ToggeableAlert";
import AddHashToArrayString from "@utils/stringManipulation/addHashToArrayString";

import { Ellipsis } from "lucide-react";
import { useDeleteConfirmation } from "@hooks/useDeleteConfirmation";
import DeleteDialog from "@components/DeletingData/DeleteDialog";
import FlagDialog from "@components/Flagging/FlagDialog";
import FlagButton from "@components/Flagging/FlagButton";
import { useFlagging } from "@hooks/useFlagging";
import { useSuggest } from "@/hooks/useSuggest";
import { useEditHandler } from "@hooks/useEditHandler";
import { useReports } from "@context/ReportsContext";
import { useSuggestions } from "@/context/SuggestionsContext";

import { useSession } from "next-auth/react";
import SuggestButton from "../Suggestions/SuggestionButton";
import SuggestionDialog from "../Suggestions/SuggestionDialog";

import ThanksButton from "@/components/Thanks/ThanksButton";
import { useThanksHandler } from "@/hooks/useThanksHandler";
import ThanksDialog from "../Thanks/ThanksDialog";

export default function ContentListing({
  dataType,
  singleContent,
  mutate,
  mode = "swr", //swr or local, local is or pages with a single piece of content
  // needed for editing, since the non-swr page needs state to reflect the edits, since it doesn't use the swr logic
}) {
  const { data: session } = useSession();

  let signedInUsersId = "";
  if (session?.user) {
    signedInUsersId = session.user.id;
  }

  const {
    showDeleteConfirmation,
    deleteTarget,
    openDelete,
    closeDelete,
    confirmDelete,
  } = useDeleteConfirmation();

  const { getStatus } = useReports();
  const { getSuggestionStatus } = useSuggestions();
  const [localContent, setLocalContent] = useState(singleContent);

  // Decide which content to use based on mode
  const content = mode === "local" ? localContent : singleContent;

  // const [content, setLocalData] =
  //   mode === "local" ? useState(singleContent) : [singleContent, null];
  // for names, we use content instead of singleContent for properties that can be edited (name, notes)
  // since pages for individual names don't have SWR
  // in "swr" mode, you always render directly from singleContent, and updates from SWR flow straight into the UI.

  const reportStatus = getStatus(dataType, singleContent._id.toString());

  const reportPendingOrNone =
    reportStatus === "pending" || reportStatus === null;

  const suggestionStatus = getSuggestionStatus(
    dataType,
    singleContent._id.toString(),
  );
  const suggestionPendingOrNone =
    suggestionStatus === "pending" || suggestionStatus === null;

  const apiEndPoint =
    dataType === "names" ? "/api/names/" : "/api/description/";

  //SHARING

  const apiBaseLink = dataType === "names" ? `/api/names` : `/api/description`;

  const linkToShare =
    dataType === "names"
      ? `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/name/${content.content}`
      : `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/description/${singleContent._id}`;

  const localLink =
    dataType === "names"
      ? `/name/${content.content}`
      : `/description/${singleContent._id}`;

  // TODO

  const { showFlagDialog, flagTarget, openFlag, closeFlag } = useFlagging();
  const {
    showSuggestionDialog,
    suggestionTarget,
    openSuggestion,
    closeSuggestion,
  } = useSuggest();

  const {
    showEditDialog,
    editTarget,
    openEdit,
    closeEdit,
    confirmEdit,
    isSaving,
  } = useEditHandler({
    apiEndpoint: apiEndPoint,
    ...(mode === "swr" ? { mutate } : { setLocalData: setLocalContent }),
  });
  const {
    showThanksDialog,
    thanksTarget,
    isSavingThanks,
    openThanks,
    closeThanks,
    confirmThanks,
  } = useThanksHandler({ apiEndpoint: "api/thanks" });

  const userIsTheCreator = singleContent.createdBy._id === signedInUsersId;

  const [showLikesSignInMessage, setShowLikesSignInMessage] = useState(false);

  //STATE FOR SHOWING SHARE OPTIONS
  const [shareSectionShowing, setShareSectionShowing] = useState(false);

  const [ideaFormToggled, setIdeaFormToggled] = useState(false);

  //for shares
  function onClickShowShares() {
    setShareSectionShowing(!shareSectionShowing);
  }

  const href = `${
    process.env.NEXT_PUBLIC_BASE_FETCH_URL
  }profile/${singleContent.createdBy.profileName.toLowerCase()}`;

  return (
    <div className="text-base flex border-t border-subtleWhite mb-4 ">
      <ProfileImage
        divStyling="min-h-10 max-w-12 mr-4 mt-3 min-w-10 max-h-12"
        profileImage={singleContent.createdBy.profileImage}
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
              <div className="w-full p-2 flex items-start">
                <a
                  href={`${
                    process.env.NEXT_PUBLIC_BASE_FETCH_URL
                  }profile/${singleContent.createdBy.profileName.toLowerCase()}`}
                  className="flex-1 min-w-0 flex flex-col"
                >
                  {/* flex-1 min-w-0 use remaining space but still wrap. Without min-w-0, text might overflow instead of wrapping.*/}
                  <span className="font-bold text-lg break-words">
                    {singleContent.createdBy.name}
                  </span>
                  <span className="font-thin text-base text-gray-500 break-words">
                    @{singleContent.createdBy.profileName}
                  </span>
                </a>

                <Menu
                  as="div"
                  className="relative inline-block text-left ml-2"
                >
                  {({ open }) => (
                    <>
                      <div>
                        <MenuButton
                          className={`px-2 py-1 rounded ${
                            open
                              ? " bg-subtleWhite text-secondary rounded-2xl"
                              : "hover:bg-blue-500 rounded-2xl"
                          }`}
                        >
                          <Ellipsis />
                        </MenuButton>
                      </div>

                      {signedInUsersId &&
                      singleContent.createdBy._id == signedInUsersId ? (
                        <MenuItems className="absolute right-0 mt-2 w-48 py-3 origin-top-right bg-secondary border text-subtleWhite border-subtleWhite rounded-md shadow-lg focus:outline-none z-50 space-y-2">
                          <MenuItem as="div">
                            {/* MenuItem as="div" prevents Headless UI from treating your button as a MenuItem that auto-closes. this way the state has time to update*/}
                            {({ focus }) => (
                              <DeleteButton
                                content={singleContent}
                                onDeleteClick={(content, e) => {
                                  e.stopPropagation(); // prevent Menu from closing immediately before the click bubbles up and closes the menu before the delete dialog state updates
                                  openDelete(content);
                                }}
                                // focus == important for keyboard styling
                                className={`ml-2 mr-6 w-full group flex items-center ${
                                  focus ? "bg-blue-500 text-white" : ""
                                }`}
                              />
                            )}
                          </MenuItem>
                          <MenuItem as="div">
                            {({ focus }) => (
                              <EditButton
                                content={singleContent}
                                onupdateEditState={(content, e) => {
                                  e.stopPropagation(); // prevent menu from closing
                                  if (content) openEdit(content);
                                }}
                                className={`ml-2 mr-6 w-full group flex items-center ${
                                  focus ? "bg-blue-500 text-white" : ""
                                }`}
                              />
                            )}
                          </MenuItem>
                        </MenuItems>
                      ) : (
                        <MenuItems className="absolute right-0 mt-2 w-48 py-3 origin-top-right bg-secondary border text-subtleWhite border-subtleWhite rounded-md shadow-lg focus:outline-none z-50">
                          <MenuItem>
                            {({ active }) => (
                              <FlagButton
                                content={singleContent}
                                dataType={dataType}
                                onClick={openFlag}
                                userIsTheCreator={
                                  singleContent.createdBy._id ===
                                  signedInUsersId
                                }
                              />
                            )}
                          </MenuItem>

                          <MenuItem as="div">
                            {({ focus }) => (
                              <SuggestButton
                                content={singleContent}
                                dataType={dataType}
                                onClick={openSuggestion}
                                userIsTheCreator={
                                  singleContent.createdBy._id ===
                                  signedInUsersId
                                }
                              />
                            )}
                          </MenuItem>
                        </MenuItems>
                      )}
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

            {!userIsTheCreator && reportPendingOrNone && showFlagDialog && (
              <FlagDialog
                dataType={dataType}
                open={showFlagDialog}
                target={flagTarget}
                onClose={closeFlag}
                signedInUsersId={signedInUsersId}
                contentId={singleContent._id}
              />
            )}

            {!userIsTheCreator &&
              suggestionPendingOrNone &&
              showSuggestionDialog && (
                <SuggestionDialog
                  dataType={dataType}
                  open={showSuggestionDialog}
                  target={suggestionTarget}
                  onClose={closeSuggestion}
                  signedInUsersId={signedInUsersId}
                  contentId={singleContent._id}
                />
              )}

            {!userIsTheCreator && showThanksDialog && (
              <ThanksDialog
                dataType={dataType}
                open={showThanksDialog}
                contentInfo={content}
                onClose={closeThanks}
                target={thanksTarget}
                onSave={confirmThanks}
                signedInUsersId={signedInUsersId}
              />
            )}

            {showEditDialog && editTarget && (
              <EditContent
                dataType={dataType}
                open={showEditDialog}
                onClose={closeEdit}
                content={editTarget}
                onSave={confirmEdit}
                signedInUsersId={signedInUsersId}
              />
            )}
          </section>

          <span
            className={`font-bold  text-center block w-full mb-2 ${
              dataType === "names" ? "text-xl" : "text-base"
            }`}
          >
            {content.content}{" "}
          </span>

          {/* ###### DESCRIPTION SECTION #### */}

          <p className="whitespace-pre-line">{content.notes}</p>

          {/* ###### TAGS SECTION #### */}
          <span className="my-4"> {AddHashToArrayString(singleContent)} </span>

          {/* ###### LIKES, SHARE, FLAG #### */}

          <div className="w-full flex justify-evenly m-2 ">
            <LikesButtonAndLikesLogic
              dataType={dataType}
              data={singleContent}
              setShowLikesSignInMessage={setShowLikesSignInMessage}
              HeartIconStyling="text-xl ml-2 my-auto mx-auto"
              HeartIconTextStyling="mx-2"
              signedInUsersId={signedInUsersId}
              apiBaseLink={apiBaseLink}
            />

            <ShareButton onClickShowShares={onClickShowShares} />

            {singleContent &&
              singleContent.createdBy._id !== signedInUsersId && (
                <ThanksButton onClick={() => openThanks(singleContent._id)} />
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

        {showLikesSignInMessage && (
          <ToggeableAlert
            text="You must be signed in to like content"
            setToggleState={setShowLikesSignInMessage}
            toggleState={showLikesSignInMessage}
          />
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
