import React from "react";
import XSvgIcon from "../ReusableSmallComponents/iconsOrSvgImages/XSvgIcon";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";

export default function deleteContentNotification({
  setShowDeleteConfirmation,
  contentId,
  signedInUsersId,
  contentCreatedBy,

  apiLink,
  setDeleteThisContentId,
}) {
  //  toast.success(`You successfully deleted your post!`)

  const handleContentDelete = async () => {
    if (signedInUsersId != contentCreatedBy) {
      toast.error(
        "validation error, session id does not match the post creator's id",
      );
      return;
    } else {
      await axios
        .delete(apiLink, {
          data: { contentId },
        })
        .then((response) => {
          // changeContentState(true);
          setShowDeleteConfirmation(false);
          console.log(`this is content id to delete ${contentId}`);
          setDeleteThisContentId(contentId);
        })
        .catch((error) => {
          console.log("there was an error when deleting your content", error);
          toast.error(`Ruh Roh! Content not deleted`);
        });
    }
  };

  return (
    <div>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-secondary bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          {/* centers content */}
          <div
            className="            
                p-4 text-center sm:items-center sm:p-0 
                max-w-3xl
                mx-auto my-2"
          >
            <div>
              <div className="">
                <div
                  className="mx-auto flex flex-col font-semibold text-secondary bg-primary
                     border-2 border-violet-400 border-dotted 
                     p-4 shadow-lg max-w-3xl"
                >
                  <div className="relative p-4 text-center rounded-lg shadow dark:bg-secondary sm:p-5">
                    {/* X Button and SVG Icon */}

                    <XSvgIcon
                      screenReaderText="Close Delete Confirmaton Screen"
                      onClickAction={() => setShowDeleteConfirmation(false)}
                    />

                    {/* Trash can icon */}
                    <svg
                      className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                      aria-hidden="true"
                      fill="white"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>

                    <p className="mb-4 text-subtleWhite bg-secondary p-5 rounded-3xl border-y border-subtleWhite">
                      Are you sure you want to delete this?
                    </p>

                    <div className="flex justify-center items-center space-x-6">
                      <GeneralButton
                        warning
                        type="submit"
                        onClick={() => handleContentDelete()}
                        text="Yes, I'm sure"
                      />

                      <GeneralButton
                        subtle
                        dataModalToggle="deleteModal"
                        onClick={() => setShowDeleteConfirmation(false)}
                        text="No, cancel"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
