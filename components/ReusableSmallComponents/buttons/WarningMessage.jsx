import React from "react";

export default function WarningMessage({ message }) {
  return (
    <span className="mt-4 bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 block text-center">
      {message}
    </span>
  );
}
