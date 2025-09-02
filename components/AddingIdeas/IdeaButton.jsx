import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import ToggeableAlert from "../ReusableMediumComponents/ToggeableAlert";
import ContainerForLikeShareFlag from "../ReusableSmallComponents/buttons/ContainerForLikeShareFlag";

export default function FlagButtonAndLogic({
  signedInUsersId,
  userAlreadySentIdea,
  userIsTheCreator,
  FlagIconStyling,
  setIdeaFormToggled,
  ideaFormIsToggled,

  ideaIconClickedByNewUser,
  setIdeaIconClickedByNewUser,
}) {
  let flaggedColor =
    userAlreadySentIdea || ideaIconClickedByNewUser ? "yellow" : "white";

  const toggleFlagColor = () => {
    setIdeaIconClickedByNewUser(!ideaIconClickedByNewUser);
  };

  const handleFlagged = (e) => {
    console.log("signedInUsersId in idea button", signedInUsersId);
    if (!signedInUsersId) {
      toast.error("Please sign in to flag", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    setIdeaFormToggled(!ideaFormIsToggled);

    if (userAlreadySentIdea || userIsTheCreator) {
      return;
    } else {
      toggleFlagColor();
    }
  };

  return (
    <>
      <ContainerForLikeShareFlag>
        {/* <div className="text-center bg-subtleBackground rounded-2xl w-20 h-9 flex justify-center align-middle"> */}

        <button
          className="w-full"
          type="button"
          onClick={handleFlagged}
          htmlFor="flaggedbutton"
        >
          <FontAwesomeIcon
            icon={faLightbulb}
            className={`${FlagIconStyling}`}
            color={flaggedColor}
          />
        </button>
      </ContainerForLikeShareFlag>
    </>
  );
}
