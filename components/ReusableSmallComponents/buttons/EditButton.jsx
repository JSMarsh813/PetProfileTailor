import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ContainerForLikeShareFlag from "./ContainerForLikeShareFlag";

export default function EditButton({ onupdateEditState, className }) {
  return (
    <ContainerForLikeShareFlag>
      <button
        className=""
        type="button"
        onClick={onupdateEditState}
        tabIndex="0"
      >
        <FontAwesomeIcon
          icon={faPencil}
          className="text-xl text-subtleWhite "
        />
      </button>
    </ContainerForLikeShareFlag>
  );
}
