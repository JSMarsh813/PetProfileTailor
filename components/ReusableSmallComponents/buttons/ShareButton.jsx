"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ContainerForLikeShareFlag from "./ContainerForLikeShareFlag";

export default function ShareButton({
  shares,
  onClickShowShares,
  shareIconStyling,
}) {
  return (
    <ContainerForLikeShareFlag>
      <button
        className="w-full"
        type="button"
        onClick={onClickShowShares}
        tabIndex="0"
      >
        <FontAwesomeIcon
          icon={faShareFromSquare}
          className={`text-xl inline ${shareIconStyling}`}
        />
      </button>
    </ContainerForLikeShareFlag>
  );
}
