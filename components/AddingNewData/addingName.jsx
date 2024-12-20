import Select from "react-select";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";

function NewNameWithTagsData({ tagList, userId, sessionFromServer }) {
  const [newName, setNewName] = useState("");
  const [tags, setTags] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [nameAlreadyExists, setNameExists] = useState(false);
  const [description, setDescription] = useState("");
  const [namesThatExist, setNamesThatExist] = useState([]);
  const [nameCheck, setNameCheck] = useState("");
  const [nameCheckFunctionRun, setNameCheckFunctionRun] = useState(false);
  const [inputError, setInputError] = useState(null);
  //regex will return null if none of the characters are invalid, so start with null to begin with

  async function checkIfNameExists() {
    let nameResponse = await fetch("/api/names/findonenamebyname/" + nameCheck);
    let nameData = await nameResponse.json();
    setNamesThatExist(nameData);
    setNameCheckFunctionRun(true);
  }

  useEffect(() => {
    let regexForInvalidCharacters = /[^a-z\d&'-áéíóúñü]+/;
    let invalidCharacters = nameCheck.match(regexForInvalidCharacters);
    //if no invalid characters, match gives us null
    console.log(`this is ${invalidCharacters}`);
    setInputError(invalidCharacters);
  }, [nameCheck]);

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
      tags: tags,
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
          toast.error(
            `Ruh Roh! The name ${newName} already exists!
            `,
          );
        } else {
          toast.error(
            `Ruh Roh! ${newName} not added. An error has occurred. Status code ${error.response.status}`,
          );
        }
      });
  }

  return (
    <div className="mx-auto mx-2">
      <section className="mx-auto text-center">
        <p> Add a name with one or more tags. </p>

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
          <li className="block"> Names can only be in lowercase</li>

          <li>
            <strong> Valid characters: </strong> a-z áéíóúñü 0-9 &&apos;-
          </li>
          <li>names must be between 2-40 characters long</li>
        </ul>

        <section className="text-center mt-4">
          <h4 className="font-semibold text-lg"> Check if a name exists: </h4>

          <input
            type="text"
            className="text-darkPurple"
            value={nameCheck}
            id="checkNameExists"
            maxLength="40"
            onChange={(e) => resetData(e)}
          />

          <button
            className="inline-block bg-yellow-300 text-purple-600 p-2 border-2 border-yellow-200  disabled:bg-errorBackgroundColor disabled:text-errorTextColor disabled:border-errorBorderColor"
            onClick={() => checkIfNameExists()}
            disabled={
              inputError !== null || nameCheck.length < 2 ? "disabled" : ""
            }
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="text-2xl"
              color={
                inputError !== null || nameCheck.length < 2 ? "white" : "purple"
              }
            />

            <span
              className="mx-2
                                   text-purple"
            >
              Search
            </span>
          </button>
          <span className="block">
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
                }/name/${namesThatExist[0].name.toLowerCase()}`}
                legacyBehavior
              >
                <GeneralButton
                  className="ml-12 my-4"
                  text={`Link to ${namesThatExist[0].name}'s page`}
                ></GeneralButton>
              </Link>
            </p>
          )}
          {inputError !== null && (
            <span>{inputError} is not a valid character</span>
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
            className="font-bold block mt-4"
            htmlFor="nameInput"
          >
            New Name
          </label>
          <input
            type="text"
            id="nameInput"
            className="text-darkPurple"
            placeholder="enter a name to add"
            onChange={(e) => setNewName(e.target.value.toLowerCase())}
            maxLength="40"
            disabled={sessionFromServer ? "" : "disabled"}
          ></input>

          <span className="block">
            {`${40 - newName.length}/40 characters left`}
          </span>

          {/* setDescription */}
          <label
            className="font-bold block mt-4"
            htmlFor="nameDescription"
          >
            Description (optional)
          </label>
          <textarea
            type="text"
            id="nameDescription"
            maxLength="500"
            className="text-darkPurple block w-full"
            placeholder="optional. please add anything that would be useful to know. Examples: the name's meaning, popular fictional or historical figures with this name, ect"
            onChange={(e) => setDescription(e.target.value.trim())}
          ></textarea>

          <span> {`${500 - description.length}/500 characters left`} </span>

          <label
            className="font-bold block mt-4"
            htmlFor="nameTags"
          >
            Tags
          </label>
          <Select
            className="text-darkPurple mb-4"
            id="nameTags"
            options={tagList.map((opt, index) => ({
              label: opt.tag,
              value: opt._id,
            }))}
            isMulti
            isSearchable
            placeholder="If you type in the tags field, it will filter the tags"
            onChange={(opt) => setTags(opt.map((tag) => tag.value))}
          />

          {/* BUTTON */}

          {!isPending && (
            <button
              className={`font-bold py-2 px-4 border-b-4 mt-2 rounded mt-4 bg-yellow-300 text-violet-800 border-yellow-100                         hover:bg-blue-400                       hover:text-white                     hover:border-blue-500
                    disabled:bg-errorBackgroundColor disabled:text-errorTextColor disabled:border-errorBorderColor"             `}
              disabled={
                sessionFromServer && newName.length >= 2 ? "" : "disabled"
              }
              onClick={handleNameSubmission}
            >
              Add name
              {(!sessionFromServer || newName.length < 2) && "(disabled)"}
            </button>
          )}

          {isPending && (
            <button
              className="btn  disabled:bg-errorBackgroundColor disabled:text-errorTextColor disabled:border-errorBorderColor"
              disabled
            >
              {" "}
              Adding name ...{" "}
            </button>
          )}

          {!sessionFromServer && (
            <span className="mt-4 bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 block text-center">
              Please sign in to submit a name{" "}
            </span>
          )}
        </form>
      </section>
    </div>
  );
}

export default NewNameWithTagsData;
