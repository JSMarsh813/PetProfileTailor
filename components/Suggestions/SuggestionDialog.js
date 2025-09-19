import { Dialog, DialogPanel } from "@headlessui/react";
import AddSuggestion from "@/components/Suggestions/AddSuggestion";
import { useSuggestions } from "@context/SuggestionsContext";
import EditSuggestion from "@components/Suggestions/EditSuggestion";

export default function SuggestionDialog({
  dataType,
  open,
  target,
  onClose,
  signedInUsersId,
  contentId,
}) {
  if (!open || !target) return null;
  const { getSuggestionStatus } = useSuggestions();
  const suggestionStatus = getSuggestionStatus(dataType, contentId.toString());

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
          {suggestionStatus === null && (
            <AddSuggestion
              dataType={dataType}
              contentInfo={target}
              apisuggestionSubmission="/api/suggestion/"
              suggestionBy={signedInUsersId}
              onClose={onClose}
            />
          )}
          {suggestionStatus === "pending" && (
            <EditSuggestion
              dataType={dataType}
              contentInfo={target}
              contentId={contentId}
              suggestionBy={signedInUsersId}
              apisuggestionSubmission="/api/suggestion/"
              onClose={onClose}
            />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
