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
}) {
  let [flaggedCount, setflaggedCount] = useState(
    data.flaggedby == [] ? 0 : data.flaggedby.length,
  );

  const [dataFlagged, setDataFlagged] = useState(false);
  let flaggedColor = dataFlagged ? "red" : "#87ceeb";
  let currentTargetedId = data._id;
  let userId = "";

  useEffect(() => {
    if (session) {
      userId = session.user._id;
    }
    data.flaggedby.includes(userId)
      ? setDataFlagged(true)
      : setDataFlagged(false);
  }, [userId]);

  const handleflagged = (e) => {
    {
      !session &&
        toast.error("Please sign in to like", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
    }

    const putflagged = async () => {
      try {
        const response = await axios.put(apiLink, {
          currentTargetedId,
          session,
        });

        dataFlagged == true
          ? setflaggedCount((flaggedCount -= 1))
          : setflaggedCount((flaggedCount += 1));
        setDataFlagged(!dataFlagged);
      } catch (err) {
        console.log("something went wrong :(", err);
      }
    };
    putflagged();
  };

  return (
    <span>
      <label id="flaggedbutton">
        <input
          type="button"
          onClick={handleflagged}
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
