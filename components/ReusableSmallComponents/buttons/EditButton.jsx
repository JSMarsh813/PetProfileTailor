import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function EditButton({ onupdateEditState, className }) {
  return (
    <label className={`justify-self-start ${className}`}>
      <input
        className=""
        type="button"
        onClick={onupdateEditState}
        tabIndex="0"
      />

      <FontAwesomeIcon
        icon={faPenToSquare}
        className="text-xl  text-emerald-500"
      />
    </label>
  );
}
