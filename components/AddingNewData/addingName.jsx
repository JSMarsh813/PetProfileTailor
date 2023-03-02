import Select from "react-select";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
// import User from '../../models/User';

import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/Link";
import GeneralButton from "../GeneralButton";

//another serverSide props from  let categoryList = await fetch('http://localhost:3000/api/name-categories);

function NewNameWithTagsData({ tagList, userId, sessionFromServer }) {
  const { data: session, status } = useSession();

  console.log(tagList);

  const [newName, setNewName] = useState("");
  const [tags, setTags] = useState([]);
  // const [description,setDescription]=useState([]);
  const [isPending, setIsPending] = useState(false);
  const [nameAlreadyExists, setNameExists] = useState(false);
  const [description, setDescription] = useState("");
  const [namesThatExist, setNamesThatExist] = useState([]);
  const [nameCheck, setNameCheck] = useState("");
  const [nameCheckFunctionRun, setNameCheckFunctionRun] = useState(false);

  // useEffect(() => {
  //   if (session?.user)
  //       {setUserId(session.user._id.toString(""))}

  // }, [session]);

  // console.log(`This is session${userId}`)

  async function checkIfNameExists() {
    let nameResponse = await fetch(
      "http://localhost:3000/api/names/findonenamebyname/" + nameCheck
    );
    let nameData = await nameResponse.json();
    console.log(nameData);
    setNamesThatExist(nameData);
    setNameCheckFunctionRun(true);
    console.log(`this is names that exist ${JSON.stringify(namesThatExist)}`);
  }

  function resetData(e) {
    setNameCheck(e.target.value.toLowerCase());
    setNameCheckFunctionRun(false);
    setNamesThatExist(null);
  }

  function handleNameSubmission(e) {
    e.preventDefault();
    //prevent buttons default behavior

    setIsPending(true);

    const nameSubmission = {
      name: newName,
      description: description,
      tags: tags,
      createdby: userId.toString(),
    };
    //  addedBy: userId,
    //from state

    // #######if the collection does not have the name, do this (allow post):  ..... otherwise update setNameExists to true
    axios
      .post("http://localhost:3000/api/names", nameSubmission)
      .then((response) => {
        console.log(response);
        setIsPending(false);
        toast.success(
          `Successfully added name: ${newName}. Heres 5 treat points as thanks for your contribution ${sessionFromServer.user.name}!`
        );
      })
      .catch((error) => {
        console.log("this is error", error);
        setNameExists(true);
        setIsPending(false);
        toast.error(`Ruh Roh! ${newName} not added`);
      });

    // fetch('http://localhost:3000/api/individualTags', {
    //   method: 'POST',
    //   headers: {"Content-type": "application/json"},
    //   body: JSON.stringify(nameSubmission)
    // }).then(()=>{
    //   console.log(`New Name added: ${nameSubmission}`)
    //   setIsPending(false)
    //     //when the request is done, by changing setIsPending to false we change the rendered button from the disabled one, to the one that allows submissions
    // }).catch((error)=>{
    //     console.log(`There was an error ${nameSubmission}`,error)
    // });

    //Error handling
    // only allow submission if NAME and TAGS are filled out, aka state isn't blank. Make button deactivated until this happens
    // (newName!=""&&tags!=[])

    //if error happens, send error

    //don't allow duplicate names
    //if name exists already, send error
    //map through server, does it include the name? if so reject and send error message

    //submit to server
    //add name to individual Names collection,submit state to server in correct format
  }

  return (
    <div style={{ width: "700px" }} className="mx-auto">
      {/* {console.log(tagList[0].individualTag)} */}

      <section className="my-6">
        <p> Add a name with one or more tags. </p>

        <h6 className="mt-4 ml-4"> Example: A dog named batman </h6>
        <img
          className="w-52 ml-6
                mb-4"
          src="https://i.pinimg.com/originals/19/44/92/194492b23b8f04d3e624eb7b6148c1be.jpg"
          alt="React Image"
        />
        <p className="ml-6">
          Batman could have the tags: comics, superheroes, batman, male, edgy
        </p>

        <section className="text-center mt-4">
          <h4 className="font-semibold text-lg"> Check if a name exists: </h4>

          <input
            type="text"
            className="text-darkPurple"
            value={nameCheck}
            maxlength="40"
            onChange={(e) => resetData(e)}
          />

          <button
            className="inline-block bg-darkPurple p-2 border-2 border-yellow-200"
            onClick={() => checkIfNameExists()}
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="text-2xl"
              color="yellow"
            />

            <span
              className="mx-2
                                   text-yellow-200"
            >
              {" "}
              Search{" "}
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
                href={`http://localhost:3000/name/${namesThatExist[0].name.toLowerCase()}`}
              >
                <GeneralButton
                  className="ml-12 my-4"
                  text={`Link to ${namesThatExist[0].name}'s page`}
                ></GeneralButton>
              </Link>
            </p>
          )}
          {nameCheckFunctionRun && !namesThatExist.length && (
            <span className="block">
              Success! {nameCheck} does NOT exist yet.
            </span>
          )}
        </section>

        <form onSubmit={handleNameSubmission}>
          {/* needs label and value for Select to work  */}
          <label className="font-bold block mt-4" for="nameInput">
            New Name
          </label>
          <input
            type="text"
            id="nameInput"
            className="text-darkPurple"
            // className={`${(!sessionFromServer)&&"bg-slate-400"}`}
            placeholder="enter a name to add"
            onChange={(e) => setNewName(e.target.value.toLowerCase())}
            maxlength="40"
            disabled={sessionFromServer ? "" : "disabled"}
            onClick={(e) => setNameExists(false)}
          ></input>

          <span className="block">
            {`${40 - newName.length}/40 characters left`}{" "}
          </span>

          <span className="block">Note: Names are saved in lowercase</span>
          {nameAlreadyExists == true && (
            <p className="text-red-500 font-bold">Name already exists</p>
          )}

          {/* setDescription */}
          <label className="font-bold block mt-4" for="nameDescription">
            Description (optional)
          </label>
          <textarea
            type="text"
            id="nameDescription"
            maxlength="500"
            className="text-darkPurple block w-full"
            placeholder="optional description: please add anything that would be useful to know. Examples: the name's meaning, popular fictional or historical figures with this name, ect"
            onChange={(e) => setDescription(e.target.value.trim())}
          ></textarea>

          <span> {`${500 - description.length}/500 characters left`} </span>

          <label className="font-bold block mt-4" for="nameTags">
            Tags
          </label>
          <Select
            className="text-darkPurple mb-4"
            id="nameTags"
            options={tagList.map((opt, index) => ({
              label: opt.tag,
              value: opt.tag,
            }))}
            isMulti
            isSearchable
            placeholder="If you type in the tags field, it will filter the tags"
            onChange={(opt) => setTags(opt.map((tag) => tag.label))}

            //update STATE of section of object
          />

          {/* BUTTON */}

          {!isPending && (
            <button
              className={`font-bold py-2 px-4 border-b-4 mt-2 rounded     

                ${
                  sessionFromServer
                    ? "mt-4 bg-yellow-300 text-violet-800 border-yellow-100                         hover:bg-blue-400                       hover:text-white                     hover:border-blue-500"
                    : "bg-slate-800"
                }`}
              disabled={sessionFromServer ? "" : "disabled"}
              onClick={handleNameSubmission}
            >
              Add name {!sessionFromServer && "(disabled)"}
            </button>
          )}

          {isPending && (
            <button className="btn" disabled>
              {" "}
              Adding name ...{" "}
            </button>
          )}

          {!sessionFromServer && (
            <span className="mt-4 bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 block text-center">
              Please sign in to submit a name{" "}
            </span>
          )}

          {/* <input type="hidden" id="userId" name="userId" value={session.user._id} /> */}
        </form>
      </section>
    </div>
  );
}

export default NewNameWithTagsData;
