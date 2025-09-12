import Select from "react-select";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import WarningMessage from "../ReusableSmallComponents/buttons/WarningMessage";
import regexInvalidInput from "@utils/stringManipulation/check-for-valid-names";
import TagsSelectAndCheatSheet from "../FormComponents/TagsSelectAndCheatSheet";
import { useTags } from "@hooks/useTags";
import StyledTextarea from "../FormComponents/StyledTextarea";

function NewNameWithTagsData({
  userId,
  categoriesWithTags,
  sessionFromServer,
}) {
  const [newName, setNewName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [nameAlreadyExists, setNameExists] = useState(false);
  const [description, setDescription] = useState("");
  const [namesThatExist, setNamesThatExist] = useState([]);
  const [nameCheck, setNameCheck] = useState("");
  const [nameCheckFunctionRun, setNameCheckFunctionRun] = useState(false);
  const [nameCheckInvalidInput, setNameCheckInvalidInput] = useState(null);
  const [newNameInvalidInput, setNewNameInvalidInput] = useState(null);
  //regex will return null if none of the characters are invalid, so start with null to begin with

  const { tagsToSubmit, handleSelectChange, handleCheckboxChange } = useTags();

  async function checkIfNameExists() {
    let nameResponse = await fetch("/api/names/findonenamebyname/" + nameCheck);
    let nameData = await nameResponse.json();
    setNamesThatExist(nameData);
    setNameCheckFunctionRun(true);
  }

  //client side validation for "check if name already exists" section
  useEffect(() => {
    const invalidCharacters = regexInvalidInput(nameCheck);
    setNameCheckInvalidInput(invalidCharacters);
  }, [nameCheck]);

  //client side validation for name submission section
  useEffect(() => {
    setNewNameInvalidInput(regexInvalidInput(newName));
  }, [newName]);

  function resetData(e) {
    setNameCheck(e.target.value.toLowerCase());
    setNameCheckFunctionRun(false);
    setNamesThatExist(null);
  }

  function handleNameSubmission(e) {
    e.preventDefault();
    setIsPending(true);

    const nameSubmission = {
      name: newName,
      description: description,
      tags: tagsToSubmit.map((tag) => tag.value),
      createdby: userId.toString(),
    };

    axios
      .post("/api/names", nameSubmission)
      .then((response) => {
        setIsPending(false);
        toast.success(
          `Successfully added name: ${newName}. Heres 3 treat points as thanks for your contribution ${sessionFromServer.user.name}!`,
        );
      })
      .catch((error) => {
        console.log("this is error", error);
        setNameExists(true);
        setIsPending(false);

        if (error.response.status == 409) {
          toast.error(`${error.response.data.message}!`);
        } else if (error.response.status == 400) {
          toast.error(`${error.response.data.message}`);
        } else {
          toast.error(
            `Ruh Roh! ${newName} not added. An error has occurred. Status code ${error.response.status}`,
          );
        }
      });
  }

  return (
    <div className="mx-2 w-full text-subtleWhite">
      <section className="mx-auto text-center">
        <p className="font-bold block mt-4 mb-2 text-xl ">
          {" "}
          Add a name with one or more tags.{" "}
        </p>

        <h6 className="mt-4 text-center"> Example: A dog named batman </h6>
        <div className="w-52 mx-auto">
          <Image
            className="rounded mb-4"
            src="/batdog.jpg"
            width={80}
            height={90}
            alt="Image of a pug with a stern batman mask on"
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
        <p className="text-center">
          Batman could have the tags: comics, superheroes, batman, male, edgy
        </p>

        <h4 className="mt-4 underline font-bold"> Submission Guidelines </h4>
        <ul className="">
          <li>
            <strong> Valid characters: </strong> a-z A-Z 0-9 & &apos; - ! ? .
          </li>
          <li> must be 2-40 characters</li>
          <li>buttons will turn on when this criteria is met</li>
        </ul>

        <section className="text-center mt-4">
          <h4 className="font-bold block mt-4 mb-2 text-xl ">
            {" "}
            Check if a name exists:{" "}
          </h4>

          <input
            type="text"
            className="bg-secondary border-subtleWhite "
            value={nameCheck}
            id="checkNameExists"
            maxLength="40"
            onChange={(e) => resetData(e)}
          />

          <button
            className="inline-block bg-subtleBackground   p-2 border-2  hover:text-subtleWhite hover:border-blue-500 hover:bg-blue-400 border-subtleWhite  disabled:bg-errorBackgroundColor disabled:text-errorTextColor disabled:border-errorBorderColor"
            //    "bg-subtleBackground text-white hover:text-white hover:border-blue-500 hover:bg-blue-400";
            onClick={() => checkIfNameExists()}
            disabled={
              nameCheckInvalidInput !== null || nameCheck.length < 2
                ? "disabled"
                : ""
            }
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="text-2xl"
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
            {`${40 - nameCheck.length}/40 characters left`}{" "}
          </span>

          {nameCheckFunctionRun && namesThatExist.length != 0 && (
            <p
              className="mt-2 
                                        text-yellow-200 font-bold
                                         bg-red-700
                                         border-2 border-yellow-200"
            >
              {namesThatExist[0].name} already exists!
              <Link
                href={`${
                  process.env.NEXT_PUBLIC_BASE_FETCH_URL
                }name/${namesThatExist[0].name.toLowerCase()}`}
                legacyBehavior
              >
                <GeneralButton
                  className="ml-12 my-4"
                  text={`Link to ${namesThatExist[0].name}'s page`}
                ></GeneralButton>
              </Link>
            </p>
          )}
          {nameCheckInvalidInput !== null && (
            <WarningMessage
              message={`${nameCheckInvalidInput} is not a valid character`}
            />
          )}

          {nameCheckFunctionRun && !namesThatExist.length && (
            <span className="block">
              Success! {nameCheck} does NOT exist yet.
            </span>
          )}
        </section>

        <hr className="mt-4" />

        <form onSubmit={handleNameSubmission}>
          {/* needs label and value for Select to work  */}
          <label
            className="font-bold block mt-4 mb-2 text-xl "
            htmlFor="nameInput"
          >
            New Name
          </label>
          <input
            type="text"
            id="nameInput"
            className="bg-secondary border-subtleWhite "
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength="40"
            disabled={sessionFromServer ? "" : "disabled"}
          ></input>
          {newNameInvalidInput !== null && (
            <WarningMessage
              message={`${newNameInvalidInput} is not a valid character`}
            />
          )}
          <span className="block my-3">
            {`${40 - newName.length}/40 characters left`}
          </span>
          {/* setDescription */}
          <label
            className="font-bold block mt-4 mb-2 text-xl "
            htmlFor="nameDescription"
          >
            Description (optional)
          </label>

          <StyledTextarea
            type="text"
            id="nameDescription"
            maxLength="1000"
            className="bg-secondary border-subtleWhite  block w-full"
            onChange={(e) => setDescription(e.target.value.trim())}
          />
          <div className="mb-8 flex flex-col gap-2">
            <span className="mt-3  block">
              {" "}
              {`${1000 - description.length}/1000 characters left`}{" "}
            </span>
            <p>Add anything that would be useful to know.</p>{" "}
            <p>
              Examples: the name's meaning, popular fictional or historical
              figures with this name.
            </p>
          </div>
          <TagsSelectAndCheatSheet
            categoriesWithTags={categoriesWithTags}
            tagsToSubmit={tagsToSubmit}
            handleSelectChange={handleSelectChange}
            handleCheckboxChange={handleCheckboxChange}
          />
          {/* BUTTON */}
          {!isPending && (
            <button
              className={`font-bold py-2 px-4 border-b-4 rounded my-4 bg-yellow-300 text-violet-800 border-yellow-100                         hover:bg-blue-400                       hover:text-subtleWhite                   hover:border-blue-500
                    disabled:bg-errorBackgroundColor disabled:text-errorTextColor disabled:border-errorBorderColor "             `}
              disabled={
                !sessionFromServer ||
                newNameInvalidInput !== null ||
                newName.length < 2
                  ? "disabled"
                  : ""
              }
              onClick={handleNameSubmission}
            >
              Add name
            </button>
          )}
          {isPending && (
            <button
              className="btn my-4 disabled:bg-errorBackgroundColor disabled:text-errorTextColor disabled:border-errorBorderColor"
              disabled
            >
              {" "}
              Adding name ...{" "}
            </button>
          )}
          {!sessionFromServer && (
            <WarningMessage message="please sign in to submit a name" />
          )}
        </form>
      </section>
    </div>
  );
}

export default NewNameWithTagsData;
