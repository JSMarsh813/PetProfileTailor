"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import GeneralButton from "./GeneralButton";

export default function EditBioProfileButton({
  session,
  apiLink,
  FollowIconStyling,
  FollowTextStyling,
  className,
  setShowProfileEditPage,
}) {
  return (
    <>
      <GeneralButton
        subtle
        type="button"
        text="edt profile"
        onClick={() => setShowProfileEditPage(true)}
      >
        <FontAwesomeIcon
          icon={faUserPlus}
          className={`ml-2 ${FollowIconStyling}`}
        />
      </GeneralButton>
    </>
  );
}
