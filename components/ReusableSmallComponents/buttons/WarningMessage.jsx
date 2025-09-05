import React from "react";

export default function WarningMessage({ message }) {
  return (
    <span className="mt-4 bg-red-900 p-2 text-white font-bold border-2 border-subtleWhite block text-center mb-4">
      {message}
    </span>
  );
}
