"use client";

import React, { useState, useEffect } from "react";
import FlagButtonAndLogic from "./FlagButton";

import FlagDialog from "./FlagDialog";

export default function FlaggingContentSection({
  userIsTheCreator,
  signedInUsersId,
  currentTargetedId,
  content,
}) {
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

  return (
    <div classcontent="">
      <FlagButtonAndLogic
        data={content}
        FlagIconStyling="text-xl"
        currentTargetedId={currentTargetedId}
        signedInUsersId={signedInUsersId}
        flagFormIsToggled={flagFormIsToggled}
        setFlagFormIsToggled={setFlagFormIsToggled}
        flagIconClickedByNewUser={flagIconClickedByNewUser}
        setFlagIconClickedByNewUser={setFlagIconClickedByNewUser}
        userHasAlreadyReportedThis={userHasAlreadyReportedThis}
        userIsTheCreator={userIsTheCreator}
      />
    </div>
  );
}
