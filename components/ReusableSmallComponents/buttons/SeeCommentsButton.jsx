import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function SeeCommentsButton({
  comments,
  onupdateCommentShowState,
}) {
  return (
    <label className="flex-1 inline ml-6">
      <input
        className="hidden"
        type="button"
        onClick={onupdateCommentShowState}
      />
      <FontAwesomeIcon
        icon={faCommentDots}
        className="text-3xl mr-2"
      />
      <span className="text-xl">{comments}</span>
    </label>
  );
}
