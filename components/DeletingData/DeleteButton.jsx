import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import DeleteContentNotification from "./DeleteContentNotification";

export default function DeleteButton({
  signedInUsersId,
  contentId,
  changeContentState,
  contentCreatedBy,
  apiLink,
  setDeleteThisContentId,
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  function updateDeleteState() {
    setShowDeleteConfirmation(true);
  }

  return (
    <>
      <label className="justify-self-end">
        <input
          className=""
          type="button"
          onClick={updateDeleteState}
          tabIndex="0"
        />

        <FontAwesomeIcon
          icon={faTrashCan}
          className="text-3xl justify-self-end text-rose-500"
        />
      </label>

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
                // changeContentState={changeContentState}
                apiLink={apiLink}
              />
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </>
  );
}
