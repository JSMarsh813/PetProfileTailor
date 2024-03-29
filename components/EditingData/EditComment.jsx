import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import XSvgIcon from "../ReusableSmallComponents/iconsOrSvgImages/XSvgIcon";

export default function EditPost({
  SetShowEditPage,
  sessionFromServer,
  rootComment,
  changeCommentState,
  setToastMessage,
  apiLink,
}) {
  //data for posts in mongoDB

  const [description, setDescription] = useState(rootComment.description);

  // const [createdby,setCreatedBy]=useState(rootComment.createdBy._id)

  const commentSubmission = async () => {
    const commentSubmission = {
      description: description,
      // createdby: createdby.toString(),
      commentId: rootComment._id,
    };

    // #######if the collection does not have the name, do this (allow post):  ..... otherwise update setNameExists to true
    // toast.success(`You successfully edited your post ${sessionFromServer.user.name}!`)

    //"/api/individualbatsignalcomments/"
    await axios
      .put(apiLink, {
        commentSubmission,
      })
      .then((response) => {
        //reloads page
        changeCommentState(true);
        SetShowEditPage(false);
      })
      .catch((error) => {
        console.log("there was an error when sending your post edits", error);

        toast.error(`Ruh Roh! Post not edited`);
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
                />

                <div
                  className="mx-auto flex flex-col font-semibold text-darkPurple bg-violet-900
                 border-2 border-violet-400 border-dotted 
                 p-4 shadow-lg max-w-3xl"
                >
                  {/* ##### DESCRIPTION AREA ######*/}
                  <h4 className="text-white"> Description </h4>

                  <textarea
                    className={`border  bg-violet-50 sec p-3 h-30  outline-none placeholder-darkPurple`}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    value={description}
                  ></textarea>
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
                onClick={() => commentSubmission()}
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
