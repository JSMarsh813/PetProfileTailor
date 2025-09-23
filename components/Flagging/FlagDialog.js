import { Dialog, DialogPanel } from "@headlessui/react";
import AddReport from "@/components/Flagging/AddReport";
import { useReports } from "@context/ReportsContext";
import EditReport from "@components/Flagging/EditReport";

export default function FlagDialog({
  dataType,
  open,
  target,
  onClose,
  signedInUsersId,
  contentId,
}) {
  const { getStatus } = useReports();
  if (!open || !target) return null;

  const reportStatus = getStatus(dataType, contentId.toString());

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
          className=" bg-secondary p-12 bg-opacity-40 h-fit"
          onClick={(e) => e.stopPropagation()}
        >
          {reportStatus === null && (
            <AddReport
              dataType={dataType}
              contentInfo={target}
              copyOfContentForReport={target}
              apiflagReportSubmission="/api/flag/flagreportsubmission/"
              flaggedByUser={signedInUsersId}
              onClose={onClose}
            />
          )}
          {reportStatus === "pending" && (
            <EditReport
              dataType={dataType}
              contentInfo={target}
              contentId={contentId}
              flaggedByUser={signedInUsersId}
              apiflagReportSubmission="/api/flag/flagreportsubmission/"
              onClose={onClose}
            />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
