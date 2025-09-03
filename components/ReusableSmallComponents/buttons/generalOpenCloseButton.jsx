import React from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function generalOpenCloseButton({ text, className, setStatus, status }) {
  return (
    <button
      className={`bg-subtleBackground  border-b-4 border-subtleWhite rounded-2xl
    text-subtleWhite  font-bold py-2 px-4 
    hover:bg-blue-500
    hover:border-blue-600
   
    ${className} `}
      onClick={() => setStatus(!status)}
    >
      {text}
      <ChevronDownIcon
        className="inline ml-2 h-5"
        aria-hidden="true"
      />
    </button>
  );
}

export default generalOpenCloseButton;
