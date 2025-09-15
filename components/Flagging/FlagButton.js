import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { useReports } from "@context/ReportsContext";

//Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

// That warning is coming from Headless UI’s MenuItem / Disclosure / Transition components, which try to attach a ref to whatever you pass inside. Regular function components (like your FlagButton) cannot receive refs unless you wrap them in React.forwardRef.

const FlagButton = React.forwardRef(({ content, onClick, dataType }, ref) => {
  const { hasReported } = useReports();
  const userHasAlreadyReported = hasReported(dataType, content._id.toString());
  const flaggedColor = userHasAlreadyReported ? "red" : "white";

  // the icon updates to red automatically after a report is submitted because

  // 1. we add the new report to the context when its successfully submitted

  // 2. the flag button is in a headlessUI menu, so when the button is clicked, its remounted so its freshly rendered

  // 3. so the check above for has Reported runs, get the lastest context, and updates to red

  return (
    <button
      ref={ref} // <- forward ref here
      type="button"
      className="ml-2 mr-6 w-full group flex items-center hover:bg-blue-400"
      onClick={() => onClick(content)}
    >
      <FontAwesomeIcon
        icon={faFlag}
        className="text-xl ml-3 mr-2"
        color={flaggedColor}
      />
      <span>Report</span>
    </button>
  );
});

export default FlagButton;
