"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import WarningMessage from "@components/ReusableSmallComponents/buttons/WarningMessage";
import regexInvalidInput from "@/utils/stringManipulation/check-for-valid-names";

export default function CheckIfContentExists({
  apiString,
  disabled,
  contentType,
}) {
  const [checkContentMessage, setCheckContentMessage] = useState("");
  const [contentCheckFunctionRun, setContentCheckFunctionRun] = useState(false);
  const [existingContent, setExistingContent] = useState([]);
  const [nameCheckInvalidInput, setContentCheckInvalidInput] = useState(null);
  const [contentCheck, setContentCheck] = useState("");

  //client side validation for "check if name already exists" section
  useEffect(() => {
    const invalidCharacters = regexInvalidInput(contentCheck);
    setContentCheckInvalidInput(invalidCharacters);
  }, [contentCheck]);

  const existingContentHref =
    contentType === "names"
      ? `${
          process.env.NEXT_PUBLIC_BASE_FETCH_URL
        }name/${existingContent[0]?.content.toLowerCase()}`
      : `descriptionhref`;

  function resetData(e) {
    setContentCheck(e.target.value.toLowerCase());
    setContentCheckFunctionRun(false);
    setExistingContent([]);
    // [] instead of null so it won't break when we check .length later
  }

  async function contentExistsCheck() {
    try {
      //"/api/names/findByName/"
      let response = await fetch(apiString + contentCheck);
      let data = await response.json();
      setContentCheckFunctionRun(true);

      if (!response.ok) {
        // Handles 400, 409, and other error statuses
        // so this shows the invalid error message
        setCheckContentMessage(
          data.message || "Unexpected response from server",
        );
        setExistingContent(data.data || []);
        return;
      }

      switch (data.type) {
        case "duplicate":
          setCheckContentMessage(
            `Ruh Roh! The name ${contentCheck} already exists`,
          );
          setExistingContent(data.data);
          break;

        case "success":
          setCheckContentMessage(data.message); // "Success! That name is not in the database"
          setExistingContent([]);
          break;

        default:
          setCheckContentMessage("Unexpected response");
          setExistingContent([]);
      }
    } catch (err) {
      setCheckContentMessage("Error checking name: " + err.message);
      setExistingContent([]);
    }
  }
  return (
    <section className="text-center mt-4">
      <h4 className="font-bold block mt-4 mb-2 text-xl ">
        {" "}
        Check if content exists:{" "}
      </h4>

      <input
        type="text"
        className={`bg-secondary border-subtleWhite rounded-2xl mr-2 ${
          disabled &&
          "disabled:bg-errorBackgroundColor   disabled:text-errorTextColor disabled:border-errorBorderColor disabled:cursor-not-allowed"
        }`}
        value={contentCheck}
        id="checkNameExists"
        disabled={disabled}
        maxLength="40"
        onChange={(e) => resetData(e)}
      />

      <button
        className="inline-block bg-subtleBackground   p-2 border-2  hover:text-subtleWhite hover:border-blue-700 hover:bg-blue-500 border-subtleWhite  disabled:bg-errorBackgroundColor disabled:text-errorTextColor rounded-2xl disabled:border-errorBorderColor disabled:cursor-not-allowed"
        onClick={() => contentExistsCheck()}
        disabled={nameCheckInvalidInput !== null || contentCheck.length < 2}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className="text-xl"
          color={"rgb(221 214 254)"} //subtle white
        />

        <span
          className="mx-2
                                       text-purple"
        >
          Search
        </span>
      </button>
      <span className="block my-3">
        {`${40 - contentCheck.length}/40 characters left`}{" "}
      </span>

      {contentCheckFunctionRun && (
        <div>
          {checkContentMessage && (
            <p className="text-sm">{checkContentMessage}</p>
          )}

          {existingContent.length > 0 && (
            <p
              className="mt-2 
                                            text-yellow-200 font-bold
                                             bg-red-700
                                             border-2 border-yellow-200"
            >
              <Link
                href={existingContentHref}
                legacyBehavior
              >
                <GeneralButton
                  className="ml-12 my-4"
                  text={`Link to ${existingContent[0].content.slice(
                    0,
                    15,
                  )}'s page`}
                ></GeneralButton>
              </Link>
            </p>
          )}
        </div>
      )}

      {nameCheckInvalidInput !== null && (
        <WarningMessage
          message={`${nameCheckInvalidInput} is not a valid character`}
        />
      )}
    </section>
  );
}
