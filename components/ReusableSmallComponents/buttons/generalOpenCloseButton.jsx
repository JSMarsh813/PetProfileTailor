import React from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function generalOpenCloseButton({ state, text, value, className, setState }) {
  return (
    <button
      className={`rounded-2xl
    text-subtleWhite  font-bold py-2 px-4 
    hover:bg-blue-500
    hover:border-blue-600 text-base
    ${state === value && "bg-subtleBackground"}
    ${className} `}
      onClick={() => setState(value)}
    >
      {/* bg-subtleBackground  border-b-4 border-subtleWhite  */}
      <p className="whitespace-normal break-words">{text}</p>
    </button>
  );
}

export default generalOpenCloseButton;
