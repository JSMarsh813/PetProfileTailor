import { Dialog, DialogPanel } from "@headlessui/react";
import DeleteContentNotification from "@components/DeletingData/DeleteContentNotification";

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
      <div
        className="fixed inset-0 bg-black/50 overflow-y-auto"
        aria-hidden="true"
        tabIndex={0} // <-- make it focusable, so we can scroll up and down with arrow keys
      >
        <DialogPanel
          className=" bg-secondary sm:p-12 bg-opacity-40 h-fit"
          onClick={(e) => e.stopPropagation()}
        >
          <DeleteContentNotification
            setShowDeleteConfirmation={onClose}
            contentId={target._id}
            signedInUsersId={signedInUsersId}
            contentCreatedBy={target.createdBy.id}
            apiLink="/api/names/"
            onConfirm={onConfirm} // passes down confirmDelete
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
