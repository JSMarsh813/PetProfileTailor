import { Dialog, DialogPanel } from "@headlessui/react";
import FormFlagReport from "./FormFlagReport";

export default function FlagDialog({ open, target, onClose }) {
  if (!open || !target) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative z-50 "
    >
      <div
        className="fixed inset-0 bg-black/50 overflow-y-auto"
        aria-hidden="true"
      >
        <DialogPanel className=" bg-darkPurple p-12 bg-opacity-40 h-fit">
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
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
