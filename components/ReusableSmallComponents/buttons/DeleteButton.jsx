import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function DeleteButton({ onupdateDeleteState }) {
  return (
    <label className="justify-self-end">
      <input
        className=""
        type="button"
        onClick={onupdateDeleteState}
        tabIndex="0"
      />

      <FontAwesomeIcon
        icon={faTrashCan}
        className="text-2xl justify-self-end text-rose-500"
      />
    </label>
  );
}
