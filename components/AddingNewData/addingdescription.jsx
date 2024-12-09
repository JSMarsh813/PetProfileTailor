import Select from "react-select";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

import { toast } from "react-toastify";

function NewDescriptionWithTagsData({
  tagList,
  userId,
  sessionFromServer,
  nameList,
}) {
  const [newDescription, setNewDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [descriptionAlreadyExists, setDescriptionExists] = useState(false);
  const [relatedNames, setRelatedNames] = useState([]);

  function handleDescriptionSubmission(e) {
    e.preventDefault();
    setIsPending(true);
    let relatedNamesArray = [];
    if (relatedNames.length) {
      relatedNamesArray = relatedNames.split(",");
    }

    const descriptionSubmission = {
      description: newDescription,
      tags: tags,
      notes: notes,
      createdby: userId.toString(),
      relatednames: relatedNamesArray,
    };

    // #######if the collection does not have the name, do this (allow post):  ..... otherwise update setNameExists to true and do not allow the new description
    axios
      .post("/api/description", descriptionSubmission)
      .then((response) => {
        setIsPending(false);
        toast.success(
          `Successfully added description: ${newDescription}. Heres 3 treat points as thanks for your contribution ${sessionFromServer.user.name}!`
        );
      })
      .catch((error) => {
        console.log("this is error", error);
        setIsPending(false);
        if (error.response.status == 409) {
          setDescriptionExists(true);
          toast.error(`Ruh Roh! ${newDescription} already exists`);
        } else {
          toast.error(
            `Ruh Roh! ${newDescription} not added. An error has occurred. Status code ${error.response.status}`
          );
        }
      });
  }

  return (
    (<div className="mx-auto mx-2 md:px-4">
      <section className="my-6 text-white text-center">
        <p> Add a description with one or more tags. </p>

        <h6 className="mt-4 ml-4 text-center"> Example: </h6>
        <div className="w-72 md:w-96 mx-auto">
          <Image
            className="mb-4"
            src="/addingdescriptionexample.jpg"
            width={90}
            height={90}
            alt="Poster of an old large dog sitting patiently which says: I like to sleep through the night. I'll bet you do, too. Because I'm a grown-ass adult. Get a dog who gets you. Adopt adult. APA adoption center"
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto"
            }} />
        </div>
        <p className="md:ml-6 text-center">
          This description could have tags like: senior, funny, quiet,
          well-behaved.
        </p>

        <form onSubmit={handleDescriptionSubmission}>
          {/* needs label and value for Select to work  */}

          <label
            className="font-bold block mt-4"
            htmlFor="descriptionInput"
          >
            New Description
          </label>

          <textarea
            type="text"
            id="nameDescription"
            className="text-darkPurple block w-full"
            placeholder="enter a description to add"
            onChange={(e) => setNewDescription(e.target.value.toLowerCase())}
            maxLength="4000"
            disabled={sessionFromServer ? "" : "disabled"}
            onClick={(e) => setDescriptionExists(false)}
          ></textarea>

          <span> {`${4000 - newDescription.length}/4000 characters left`}</span>

          {descriptionAlreadyExists == true && (
            <p className="text-red-500 font-bold">Description already exists</p>
          )}

          {/* NOTES SECTION           */}

          <label
            className="font-bold block mt-4"
            htmlFor="notesinput"
          >
            Notes
          </label>

          <textarea
            type="text"
            id="noteinput"
            className="text-darkPurple block w-full"
            maxLength="800"
            placeholder="(Optional) enter any notes to add. For example, explaining if it has any references to shows/popular culture, ect."
            onChange={(e) => setNotes(e.target.value.toLowerCase())}
            disabled={sessionFromServer ? "" : "disabled"}
          ></textarea>
          <span> {`${800 - notes.length}/800 characters left`}</span>

          {/* TAGS SECTION */}
          <label
            className="font-bold block mt-4"
            htmlFor="descriptionTags"
          >
            Tags
          </label>

          <Select
            className="text-darkPurple mb-4"
            id="descriptionTags"
            options={tagList.map((opt, index) => ({
              label: opt.tag,
              value: opt._id,
            }))}
            isMulti
            isSearchable
            placeholder="If you type in the tags field, it will filter the tags"
            onChange={(opt) => setTags(opt.map((tag) => tag.value))}
          />

          {/* RELATED NAMES SECTION */}
          <label
            className="font-bold block mt-4"
            htmlFor="relatedNames"
          >
            Related Names
          </label>
          <input
            className="text-darkPurple mb-4"
            id="relatedNames"
            type="text"
            value={relatedNames}
            onChange={(e) =>
              setRelatedNames(e.target.value.toLowerCase().trim())
            }
          ></input>
          <p>
            {" "}
            Please seperate multiple names with a comma. Example:
            Jedi,Luke,obiwan,Darth
          </p>
          {/* <Select
            className="text-darkPurple mb-4"
            id="descriptionTags"
            options={nameList.map((opt, index) => ({
              label: opt,
              value: opt,
            }))}
            isMulti
            isSearchable
            placeholder="If you type in the tags field, it will filter the tags"
            onChange={(opt) =>
              setRelatedNames(
                opt.map((tag) => {
                  tag.label;
                })
              )
            }
          /> */}
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
              onClick={handleDescriptionSubmission}
            >
              Add description {!sessionFromServer && "(disabled)"}
            </button>
          )}

          {isPending && (
            <button
              className="btn"
              disabled
            >
              {" "}
              Adding description ...{" "}
            </button>
          )}

          {!sessionFromServer && (
            <span className="mt-4 bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 block text-center">
              Please sign in to submit a description{" "}
            </span>
          )}
        </form>
      </section>
    </div>)
  );
}

export default NewDescriptionWithTagsData;
