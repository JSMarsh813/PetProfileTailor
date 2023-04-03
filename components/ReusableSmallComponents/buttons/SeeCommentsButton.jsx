import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function SeeCommentsButton({
  comments,
  onupdateCommentShowState,
}) {
  return (
    <span>
      <input
        className=""
        type="button"
        onClick={onupdateCommentShowState}
        tabindex="0"
        id="likesbutton"
      />
      <label
        className="flex-1 inline ml-2 sm:ml-6"
        htmlFor="likesbutton"
      >
        <FontAwesomeIcon
          icon={faCommentDots}
          className="text-3xl mr-2"
        />
        <span className="text-xl">{comments}</span>
      </label>
    </span>
  );
}
