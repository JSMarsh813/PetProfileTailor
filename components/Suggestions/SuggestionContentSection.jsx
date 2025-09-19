"use client";

import React, { useState, useEffect } from "react";
import IdeaButton from "./SuggestionButton";
import IdeaForm from "./SuggestionForm";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function SuggestionContentSection({
  userIsTheCreator,
  signedInUsersId,
  content,
  apiIdeaSubmission,
  apiaddUserToIdea,
  //STATE FOR FLAG COUNT AND COLOR AND FORM
  ideaFormToggled,
  setIdeaFormToggled,
  dataType,
}) {
  //flagIconClickedByNewUser:
  // the only user that can toggle the report flag because they are
  // 1. not the content's creator
  // 2. haven't successfully submitted a report
  const [ideaIconClickedByNewUser, setIdeaIconClickedByNewUser] = useState();

  let createCopyOfContentBasedOnContentType = function (dataType, content) {
    if (dataType === "descriptions") {
      let copyOfContent = {
        content: content.content,
        notes: content.notes,
        relatednames: content.relatednames,
      };
      return copyOfContent;
    } else if (dataType === "names") {
      let copyOfContent = {
        name: content.content,
        description: content.notes,
      };
      return copyOfContent;
    } else if (dataType === "users") {
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
    dataType,
    content,
  );

  return (
    <>
      <div classcontent=" bg-violet-900">
        <IdeaButton
          data={content}
          FlagIconStyling="text-xl"
          signedInUsersId={signedInUsersId}
          ideaFormToggled={ideaFormToggled}
          setIdeaFormToggled={setIdeaFormToggled}
          ideaIconClickedByNewUser={ideaIconClickedByNewUser}
          setIdeaIconClickedByNewUser={setIdeaIconClickedByNewUser}
          userIsTheCreator={userIsTheCreator}
        />
      </div>

      {!userIsTheCreator &&
        ideaFormToggled && ( //!userAlreadySentIdea
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
                  dataType={dataType}
                  contentInfo={content}
                  copyOfContentForReport={copyOfContentForReport}
                  IdeaByUser={signedInUsersId}
                  setIdeaFormToggled={setIdeaFormToggled}
                  apiIdeaSubmission={apiIdeaSubmission}
                  setIdeaIconClickedByNewUser={setIdeaIconClickedByNewUser}
                  apiaddUserToIdea={apiaddUserToIdea}
                  ideaFormToggled={ideaFormToggled}
                />
              </DialogPanel>
            </div>
          </Dialog>
        )}
    </>
  );
}
