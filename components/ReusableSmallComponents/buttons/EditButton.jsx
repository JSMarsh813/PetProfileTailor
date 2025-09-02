import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function EditButton({ onupdateEditState, className }) {
  return (
    <div className={`justify-self-start ${className}`}>
      <button
        className="gap-x-2"
        type="button"
        onClick={onupdateEditState}
        tabIndex="0"
      >
        <FontAwesomeIcon
          icon={faPencil}
          className="text-xl text-subtleWhite "
        />
      </button>
    </div>
  );
}
