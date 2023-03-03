import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function EditButton({ setShowEditPage, className }) {
  return (
    <label className={`justify-self-start ${className}`}>
      <input
        className="hidden"
        type="button"
        onClick={setShowEditPage}
      />

      <FontAwesomeIcon
        icon={faPenToSquare}
        className="text-2xl  text-emerald-500"
      />
    </label>
  );
}
