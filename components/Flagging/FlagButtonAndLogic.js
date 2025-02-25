import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import ToggeableAlert from "../ReusableMediumComponents/ToggeableAlert";

export default function FlagButtonAndLogic({
  signedInUsersId,
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
    if (!signedInUsersId) {
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
    <>
      <div className="block text-center">
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
      </div>

      {flagFormIsToggled && userIsTheCreator && (
        <ToggeableAlert
          text="You cannot flag your own content 😜"
          setToggleState={setFlagFormIsToggled}
          toggleState={flagFormIsToggled}
        />
      )}

      {flagFormIsToggled && userHasAlreadyReportedThis && (
        <ToggeableAlert
          text="We are in the process of reviewing your report. This content cannot be
                flagged again until the prior report is reviewed"
          setToggleState={setFlagFormIsToggled}
          toggleState={flagFormIsToggled}
        />
      )}
    </>
  );
}
