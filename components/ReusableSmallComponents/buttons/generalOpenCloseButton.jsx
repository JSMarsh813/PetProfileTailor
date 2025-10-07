import React from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function generalOpenCloseButton({
  state,
  text,
  value,
  className,
  setState,
  sideText,
}) {
  console.log("sidetext", sideText);
  return (
    <button
      className={`hover:rounded-2xl
    text-subtleWhite  font-bold py-2 px-4 
    hover:bg-blue-500
    hover:border-blue-600 text-base
    ${state === value && "border-b-4 border-subtleWhite"}
    ${className} `}
      onClick={() => setState(value)}
    >
      {/* bg-subtleBackground  border-b-4 border-subtleWhite  */}
      <div className="flex">
        <p className="whitespace-normal break-words mr-2">{text}</p>
        {sideText && <span> {sideText}</span>}
      </div>
    </button>
  );
}

export default generalOpenCloseButton;
