import React, { useState, useEffect } from "react";
import FlagButtonAndLogic from "../ReusableSmallComponents/buttons/FlagButtonAndLogic";
import FormFlagReport from "../AddingNewData/FormFlagReport";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
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
  apiflagReportSubmission,
  apiaddUserToFlaggedByArray,
}) {
  //STATE FOR FLAG COUNT AND COLOR AND FORM

  const [flaggedCount, setFlaggedCount] = useState(
    content.flaggedby === undefined ? 0 : content.flaggedby.length,
  );

  const [userHasAlreadyReportedThis, setUserHasAlreadyReportedThis] = useState(
    content.flaggedby != null
      ? content.flaggedby.includes(signedInUsersId)
      : false,
  );

  //flagIconClickedByNewUser:
  // the only user that can toggle the report flag because they are
  // 1. not the content's creator
  // 2. haven't successfully submitted a report
  const [flagIconClickedByNewUser, setFlagIconClickedByNewUser] = useState(
    userHasAlreadyReportedThis,
  );

  const [flagFormIsToggled, setFlagFormIsToggled] = useState(false);

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
    }
  };

  let copyOfContentForReport = createCopyOfContentBasedOnContentType(
    contentType,
    content,
  );

  return (
    <>
      <div classcontent=" bg-violet-900">
        <FlagButtonAndLogic
          data={content}
          FlagIconStyling="text-3xl my-auto mx-auto pt-4"
          FlagIconTextStyling="ml-2 inline-block pb-4"
          currentTargetedId={currentTargetedId}
          signedInUsersId={signedInUsersId}
          flagFormIsToggled={flagFormIsToggled}
          setFlagFormIsToggled={setFlagFormIsToggled}
          flaggedCount={flaggedCount}
          setFlaggedCount={setFlaggedCount}
          flagIconClickedByNewUser={flagIconClickedByNewUser}
          setFlagIconClickedByNewUser={setFlagIconClickedByNewUser}
          userHasAlreadyReportedThis={userHasAlreadyReportedThis}
          userIsTheCreator={userIsTheCreator}
        />
      </div>

      {!userIsTheCreator &&
        !userHasAlreadyReportedThis &&
        flagFormIsToggled && (
          <Dialog
            open={flagFormIsToggled}
            onClose={() => setFlagFormIsToggled(false)}
            className="relative z-50 "
          >
            <div
              className="fixed inset-0 flex w-screen overflow-scroll justify-center"
              tabIndex={1}
            >
              <DialogPanel className=" bg-darkPurple p-12 bg-opacity-80 h-fit">
                <FormFlagReport
                  contentType={contentType}
                  contentInfo={content}
                  copyOfContentForReport={copyOfContentForReport}
                  flaggedByUser={signedInUsersId}
                  setFlagFormIsToggled={setFlagFormIsToggled}
                  flagFormIsToggled={flagFormIsToggled}
                  setFlaggedCount={setFlaggedCount}
                  flaggedCount={flaggedCount}
                  apiflagReportSubmission={apiflagReportSubmission}
                  setFlagIconClickedByNewUser={setFlagIconClickedByNewUser}
                  apiaddUserToFlaggedByArray={apiaddUserToFlaggedByArray}
                  setUserHasAlreadyReportedThis={setUserHasAlreadyReportedThis}
                />
              </DialogPanel>
            </div>
          </Dialog>
        )}
    </>
  );
}
