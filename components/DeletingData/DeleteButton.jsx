import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Dialog, DialogPanel } from "@headlessui/react";
import DeleteContentNotification from "./DeleteContentNotification";

export default function DeleteButton({
  className,
  signedInUsersId,
  contentId,
  changeContentState,
  contentCreatedBy,
  apiLink,
  setDeleteThisContentId,
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  function updateDeleteState() {
    console.log("delete clicked");
    setShowDeleteConfirmation(true);
  }

  return (
    <>
      <div className={`justify-self-end ${className}`}>
        <button
          className="gap-x-2"
          type="button"
          onClick={updateDeleteState}
          tabIndex="0"
          name="delete-button"
        >
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-xl w-4 h-4"
          />

          <span className="ml-1"> Delete </span>
        </button>
      </div>

      {showDeleteConfirmation && (
        <Dialog
          open={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          className="relative z-50 "
        >
          <div
            className="fixed inset-0 flex w-screen overflow-scroll justify-center"
            tabIndex={1}
          >
            <DialogPanel className=" bg-darkPurple p-12 bg-opacity-80 h-fit">
              <DeleteContentNotification
                setShowDeleteConfirmation={setShowDeleteConfirmation}
                contentId={contentId}
                signedInUsersId={signedInUsersId}
                contentCreatedBy={contentCreatedBy}
                setDeleteThisContentId={setDeleteThisContentId}
                apiLink={apiLink}
              />
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </>
  );
}
