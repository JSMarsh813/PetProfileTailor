import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FlagButtonAndLogic({
  data,
  session,
  apiLink,
  FlagIconStyling,
  FlagIconTextStyling,
  onClickToggleFlagForm,
  flaggedCount,
  setFlaggedCount,
  dataFlagged,
  setDataFlagged,
}) {
  let flaggedColor = dataFlagged ? "red" : "#87ceeb";
  let currentTargetedId = data._id;
  let userId = "";

  console.log(dataFlagged);

  useEffect(() => {
    if (session) {
      userId = session.user._id;
    }

    data.flaggedby.includes(userId)
      ? setDataFlagged(true)
      : setDataFlagged(false);
  }, [userId]);

  const handleFlagged = (e) => {
    if (!session) {
      toast.error("Please sign in to flag", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    onClickToggleFlagForm();

    const putFlagged = async () => {
      try {
        const response = await axios.put(apiLink, {
          currentTargetedId,
          session,
        });

        dataFlagged == true
          ? setFlaggedCount((flaggedCount -= 1))
          : setFlaggedCount((flaggedCount += 1));
        setDataFlagged(!dataFlagged);
      } catch (err) {
        console.log("something went wrong :(", err);
      }
    };
    putFlagged();
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
