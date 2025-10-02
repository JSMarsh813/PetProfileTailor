import React from "react";
import XSvgIcon from "../iconsOrSvgImages/XSvgIcon";

export default function WarningMessage({ message, state }) {
  return (
    <div className="relative">
      <p className="mt-4 bg-red-900 p-2 text-white font-bold border-2 border-subtleWhite block text-center mb-4">
        {message}
      </p>
      {state && (
        <XSvgIcon
          screenReaderText="Close message"
          onClickAction={() => state("")}
        />
      )}
    </div>
  );
}
