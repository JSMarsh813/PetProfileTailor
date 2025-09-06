import { Dialog, DialogPanel } from "@headlessui/react";
import FormFlagReport from "./FormFlagReport";

export default function FlagDialog({ open, target, onClose }) {
  if (!open || !target) return null;

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      // this way the form won't close when the user clicks on the backdrop
      className="relative z-50 "
    >
      <div
        className="fixed inset-0 bg-black/50 overflow-y-auto"
        aria-hidden="true"
        tabIndex={0} // <-- make it focusable, so we can scroll up and down with arrow keys
      >
        <DialogPanel
          className=" bg-darkPurple p-12 bg-opacity-40 h-fit"
          onClick={(e) => e.stopPropagation()}
        >
          <FormFlagReport
            contentInfo={target}
            copyOfContentForReport={target} // adjust if needed
            apiflagReportSubmission="/api/flag/flagreportsubmission/"
            apiaddUserToFlaggedByArray="/api/flag/addToNamesFlaggedByArray/"
            flaggedByUser={target.currentUserId} // pass signedInUsersId here
            flagFormIsToggled={true} // form is visible when dialog opens
            setFlagFormIsToggled={() => {}} // optional callback if needed
            setFlagIconClickedByNewUser={() => {}} // optional
            setUserHasAlreadyReportedThis={() => {}} // optional
            contentType="name"
            onClose={onClose}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
