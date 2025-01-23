import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FlagButtonAndLogic({
  session,
  userHasAlreadyReportedThis,
  userIsTheCreator,
  FlagIconStyling,
  FlagIconTextStyling,
  setFlagFormIsToggled,
  flagFormIsToggled,
  flaggedCount,
  setFlaggedCount,
  flagIconClickedByNewUser,
  setFlagIconClickedByNewUser,
}) {
  let flaggedColor =
    userHasAlreadyReportedThis || flagIconClickedByNewUser ? "red" : "#87ceeb";

  const toggleFlagColorAndNumber = () => {
    flagIconClickedByNewUser == true
      ? setFlaggedCount((flaggedCount -= 1))
      : setFlaggedCount((flaggedCount += 1));
    setFlagIconClickedByNewUser(!flagIconClickedByNewUser);
  };

  const handleFlagged = (e) => {
    if (!session) {
      toast.error("Please sign in to flag", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    setFlagFormIsToggled(!flagFormIsToggled);

    if (userHasAlreadyReportedThis || userIsTheCreator) {
      return;
    } else {
      toggleFlagColorAndNumber();
    }
  };

  return (
    <span>
      <label id="flaggedbutton">
        <input
          type="button"
          onClick={handleFlagged}
          htmlFor="flaggedbutton"
        />

        <FontAwesomeIcon
          icon={faFlag}
          className={`${FlagIconStyling}`}
          color={flaggedColor}
        />

        <span className={`${FlagIconTextStyling}`}>{flaggedCount}</span>
      </label>
    </span>
  );
}
