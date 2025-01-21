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
      <label className="">
        <input
          className="flex-1 inline ml-1"
          type="button"
          onClick={onupdateCommentShowState}
          tabIndex="0"
        />

        <FontAwesomeIcon
          icon={faCommentDots}
          className="text-3xl mr-2"
        />
        <span className="text-xl">{comments}</span>
      </label>
    </span>
  );
}
