import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { useSuggestions } from "@context/SuggestionsContext";

//Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

// That warning is coming from Headless UI’s MenuItem / Disclosure / Transition components, which try to attach a ref to whatever you pass inside. Regular function components (like your SuggestButton) cannot receive refs unless you wrap them in React.forwardRef.

const SuggestButton = React.forwardRef(
  ({ content, onClick, dataType }, ref) => {
    const { hasSuggested } = useSuggestions();
    const userHasAlreadySuggested = hasSuggested(
      dataType,
      content._id.toString(),
    );
    const suggestedColor = userHasAlreadySuggested ? "yellow" : "white";

    // the icon updates to red automatically after a report is submitted because

    // 1. we add the new report to the context when its successfully submitted

    // 2. the suggest button is in a headlessUI menu, so when the button is clicked, its remounted so its freshly rendered

    // 3. so the check above for has Suggested runs, get the lastest context, and updates to red

    return (
      <button
        ref={ref} // <- forward ref here
        type="button"
        className="ml-2 mr-6 w-full group flex items-center hover:bg-blue-500"
        onClick={() => onClick(content)}
      >
        <FontAwesomeIcon
          icon={faLightbulb}
          className="text-xl ml-3 mr-2"
          color={suggestedColor}
        />
        <span>Suggestion</span>
      </button>
    );
  },
);

export default SuggestButton;
