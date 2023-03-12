import React, { useEffect, useState } from "react";
import Select from "react-select";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import XSvgIcon from "../ReusableSmallComponents/iconsOrSvgImages/XSvgIcon";

export default function EditName({
  SetShowEditPage,
  description,
  sessionFromServer,
  setItemChanged,
  setToastMessage,
  tagList,
  nameList,
}) {
  const [descriptionState, setDescription] = useState(description.description);
  const [notes, setNotes] = useState(description.notes);
  const [tags, setTags] = useState(
    description.tags.map((tag) => ({ label: tag.tag, value: tag._id }))
  );

  const [relatedNames, setRelatedNames] = useState(
    description.relatednames.join(",")
  );

  const descriptionSubmission = async () => {
    const descriptionSubmission = {
      description: descriptionState,
      notes: notes,
      tags: tags.map((tag) => tag.value),
      //changing each {label: tag.tag, value:tag._id} into just an object id
      descriptionId: description._id,
      relatednames: relatedNames,
    };
    console.log(descriptionSubmission);

    await axios
      .put("/api/description", {
        descriptionSubmission,
      })
      .then((response) => {
        console.log(response);
        //reloads page
        setItemChanged(true);
        SetShowEditPage(false);
      })
      .catch((error) => {
        console.log("there was an error when sending your edits", error);

        toast.error(`Ruh Roh! Description not edited`);
      });
  };

  return (
    <div>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          {/* centers content */}
          <div
            className="            
            p-4 text-center sm:items-center sm:p-0 
            max-w-3xl
            mx-auto my-2"
          >
            <div>
              <div className="relative">
                {/* X Button and SVG Icon */}

                <XSvgIcon
                  screenReaderText="Close Edit Screen"
                  onClickAction={() => SetShowEditPage(false)}

                  //  onClick={()=>SetShowEditPage(false)}
                />

                <div
                  className="mx-auto flex flex-col font-semibold text-darkPurple bg-violet-900
                 border-2 border-violet-400 border-dotted 
                 p-4 shadow-lg max-w-3xl"
                >
                  {/* ##### Description AREA ######*/}
                  <h4 className="text-white mt-4"> Description </h4>
                  <textarea
                    type="text"
                    id="nameDescription"
                    className="border bg-violet-50  border-violet-200 p-2 mb-4 outline-none placeholder-darkPurple block w-full"
                    onChange={(e) => setDescription(e.target.value)}
                    value={descriptionState}
                  />

                  {/* #####Notes AREA ######*/}

                  <h4 className="text-white"> notes </h4>

                  <textarea
                    className={`border  bg-violet-50 sec p-3 h-30  outline-none placeholder-darkPurple`}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                    value={notes}
                  ></textarea>

                  {/* ##### ATTACHING TAGS  ######*/}
                  <label
                    className="font-bold block mt-4 text-white"
                    htmlFor="nameTags"
                  >
                    Tags:
                  </label>
                  <div className="text-white"></div>
                  <Select
                    value={tags.map((tag) => ({
                      label: tag.label,
                      value: tag.value,
                    }))}
                    className={`text-darkPurple mb-4 border ${
                      tags ? "border-violet-200" : "border-rose-500 border-2"
                    }`}
                    id="nameTags"
                    options={tagList.map((opt, index) => ({
                      label: opt.tag,
                      value: opt._id,
                    }))}
                    isMulti
                    isSearchable
                    onChange={(opt) =>
                      setTags(
                        opt.map((tag) => ({
                          label: tag.label,
                          value: tag.value,
                        }))
                      )
                    }
                  />
                  {/* RELATED NAMES SECTION */}
                  <label
                    className="font-bold block mt-4 text-white"
                    htmlFor="relatedNames"
                  >
                    Related Names
                  </label>
                  <input
                    className="text-darkPurple mb-4 "
                    id="relatedNames"
                    type="text"
                    value={relatedNames}
                    onChange={(e) =>
                      setRelatedNames(e.target.value.toLowerCase().trim())
                    }
                  ></input>
                  <p className="text-white">
                    Please seperate multiple names with a comma. Example:
                    Jedi,Luke,obiwan,Darth
                  </p>
                </div>
              </div>
            </div>

            {/* ###########                       buttons                     ############## */}
            <div
              className="bg-darkPurple px-4 py-3
                 sm:px-6 grid grid-cols-2"
            >
              <button
                type="button"
                className="justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-base 
                 
                 font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => descriptionSubmission()}
              >
                Save
              </button>

              <button
                type="button"
                className="mt-3 inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
          sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => SetShowEditPage(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
