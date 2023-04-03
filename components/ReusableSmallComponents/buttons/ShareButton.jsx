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
      <label
        className="flex-1 inline ml-1 sm:ml-6"
        htmlFor="sharebutton"
      >
        <input
          className=""
          type="button"
          onClick={onClickShowShares}
          tabindex="0"
          id="sharebutton"
        />
        <FontAwesomeIcon
          icon={faShareFromSquare}
          className={`text-2xl sm:mr-2 inline flex-1 ${shareIconStyling}`}
        />
      </label>
    </span>
  );
}
