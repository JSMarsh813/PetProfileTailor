import React from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function generalOpenCloseButton({ text, styling, setStatus, status }) {
  return (
    <button
      className={`text-xl bg-yellow-200  border-b-4 border-yellow-600
    text-violet-700  font-bold py-2 px-4 
    hover:bg-violet-700 
    hover:text-yellow-300
    hover:border-yellow-400 rounded
    ${styling} `}
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
