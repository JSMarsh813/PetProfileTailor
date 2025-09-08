import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

//Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

// Ah! That warning is coming from Headless UI’s MenuItem / Disclosure / Transition components, which try to attach a ref to whatever you pass inside. Regular function components (like your FlagButton) cannot receive refs unless you wrap them in React.forwardRef.

const FlagButton = React.forwardRef(
  (
    {
      content,
      onClick,
      userHasAlreadyReported,
      userIsTheCreator,
      reportsSetRef,
    },
    ref,
  ) => {
    const flaggedColor = userHasAlreadyReported ? "red" : "white";

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
  },
);

export default FlagButton;
