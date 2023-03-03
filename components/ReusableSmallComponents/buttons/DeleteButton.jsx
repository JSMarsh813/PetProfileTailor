import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function DeleteButton({ onupdateDeleteState }) {
  return (
    <label className="justify-self-end">
      <input
        className="hidden"
        type="button"
        onClick={onupdateDeleteState}
      />

      <FontAwesomeIcon
        icon={faTrashCan}
        className="text-2xl justify-self-end text-rose-500"
      />
    </label>
  );
}
