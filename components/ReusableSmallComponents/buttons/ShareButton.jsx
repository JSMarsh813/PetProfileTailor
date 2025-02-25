import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function ShareButton({
  shares,
  onClickShowShares,
  shareIconStyling,
}) {
  return (
    <span>
      <label className="flex-1 inline ">
        <input
          className=""
          type="button"
          onClick={onClickShowShares}
          tabIndex="0"
        />
        <FontAwesomeIcon
          icon={faShareFromSquare}
          className={`text-xl inline flex-1 ${shareIconStyling}`}
        />
      </label>
    </span>
  );
}
