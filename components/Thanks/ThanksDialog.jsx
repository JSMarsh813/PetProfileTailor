import { Dialog, DialogPanel } from "@headlessui/react";
import AddThanks from "./AddThanks";

export default function ThanksDialog({
  dataType,
  open,
  target,
  onClose,
  signedInUsersId,
  contentId,
}) {
  if (!open || !target) return null;

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      // this way the form won't close when the user clicks on the backdrop
      className="relative z-50 "
    >
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto"
        aria-hidden="true"
        tabIndex={0} // <-- make it focusable, so we can scroll up and down with arrow keys
      >
        <DialogPanel
          className=" bg-secondary p-12 bg-opacity-40 h-fit "
          onClick={(e) => e.stopPropagation()}
        >
          <AddThanks
            dataType={dataType}
            contentId={contentId}
            apisuggestionSubmission="/api/suggestion/"
            suggestionBy={signedInUsersId}
            onClose={onClose}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
