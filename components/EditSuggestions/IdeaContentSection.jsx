"use client";

import React, { useState, useEffect } from "react";
import IdeaButton from "./IdeaButton";
import IdeaForm from "./IdeaForm";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function FlaggingContentSection({
  userIsTheCreator,
  signedInUsersId,
  currentTargetedId,
  content,
  contentType,
  apiIdeaSubmission,
  apiaddUserToIdea,
  //STATE FOR FLAG COUNT AND COLOR AND FORM
  userAlreadySentIdea,
  setUserAlreadySentIdea,
  ideaFormToggled,
  setIdeaFormToggled,
  categoriesWithTags,
}) {
  //flagIconClickedByNewUser:
  // the only user that can toggle the report flag because they are
  // 1. not the content's creator
  // 2. haven't successfully submitted a report
  const [ideaIconClickedByNewUser, setIdeaIconClickedByNewUser] =
    useState(userAlreadySentIdea);

  console.log("categories in idea content", categoriesWithTags);
  console.log(
    "userAlreadySentIdea",
    userAlreadySentIdea,
    "ideaFormToggled",
    ideaFormToggled,
  );

  let createCopyOfContentBasedOnContentType = function (contentType, content) {
    if (contentType === "description") {
      let copyOfContent = {
        content: content.description,
        notes: content.notes,
        relatednames: content.relatednames,
      };
      return copyOfContent;
    } else if (contentType === "name") {
      let copyOfContent = {
        name: content.name,
        description: content.description,
      };
      return copyOfContent;
    } else if (contentType === "comment") {
      let copyOfContent = {
        image: content.image,
        description: content.description,
        parentCommentId: content.parentcommentid,
      };
      return copyOfContent;
    } else if (contentType === "post") {
      let copyOfContent = {
        image: content.image,
        alttext: content.alttext,
        title: content.description,
      };
      return copyOfContent;
    } else if (contentType === "user") {
      let copyOfContent = {
        name: content.name,
        profilename: content.profilename,
        profileimage: content.prfileimage,
        bioblurb: content.bioblurb,
        location: content.location,
      };
      return copyOfContent;
    }
  };

  let copyOfContentForReport = createCopyOfContentBasedOnContentType(
    contentType,
    content,
  );

  return (
    <>
      <div classcontent=" bg-violet-900">
        <IdeaButton
          data={content}
          FlagIconStyling="text-xl"
          currentTargetedId={currentTargetedId}
          signedInUsersId={signedInUsersId}
          ideaFormToggled={ideaFormToggled}
          setIdeaFormToggled={setIdeaFormToggled}
          ideaIconClickedByNewUser={ideaIconClickedByNewUser}
          setIdeaIconClickedByNewUser={setIdeaIconClickedByNewUser}
          userAlreadySentIdea={userAlreadySentIdea}
          userIsTheCreator={userIsTheCreator}
        />
      </div>

      {!userIsTheCreator && !userAlreadySentIdea && ideaFormToggled && (
        <Dialog
          open={ideaFormToggled}
          onClose={() => {}}
          // this way the form won't close when the user clicks on the backdrop
          className="relative z-50 "
          tabIndex={0} // <-- make it focusable, so we can scroll up and down with arrow keys
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 overflow-y-auto"
            aria-hidden="true"
            tabIndex={0} // <-- make it focusable, so we can scroll up and down with arrow keys
          >
            <DialogPanel className=" bg-secondary p-12 bg-opacity-80 h-fit">
              <IdeaForm
                contentType={contentType}
                contentInfo={content}
                copyOfContentForReport={copyOfContentForReport}
                IdeaByUser={signedInUsersId}
                setIdeaFormToggled={setIdeaFormToggled}
                apiIdeaSubmission={apiIdeaSubmission}
                setIdeaIconClickedByNewUser={setIdeaIconClickedByNewUser}
                apiaddUserToIdea={apiaddUserToIdea}
                ideaFormToggled={ideaFormToggled}
                setUserAlreadySentIdea={setUserAlreadySentIdea}
                categoriesWithTags={categoriesWithTags}
              />
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </>
  );
}
