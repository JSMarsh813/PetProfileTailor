import { Dialog, DialogPanel } from "@headlessui/react";
import DeleteContentNotification from "./DeleteContentNotification";

export default function DeleteDialog({
  open,
  target,
  onClose,
  onConfirm, // new prop
  signedInUsersId,
}) {
  if (!open || !target) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen justify-center items-start overflow-auto">
        <DialogPanel className="bg-secondary p-12 bg-opacity-80 rounded-md">
          <DeleteContentNotification
            setShowDeleteConfirmation={onClose}
            contentId={target._id}
            signedInUsersId={signedInUsersId}
            contentCreatedBy={target.createdby._id}
            apiLink="/api/names/"
            onConfirm={onConfirm} // passes down confirmDelete
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
