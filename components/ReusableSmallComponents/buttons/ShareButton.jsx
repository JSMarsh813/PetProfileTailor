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
    <label className="flex-1 inline ml-6">
      <input
        className="hidden"
        type="button"
        onClick={onClickShowShares}
      />

      <FontAwesomeIcon
        icon={faShareFromSquare}
        className={`text-2xl mr-2 inline flex-1 ${shareIconStyling}`}
      />
    </label>
  );
}
