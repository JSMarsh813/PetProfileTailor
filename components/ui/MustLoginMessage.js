import React from "react";

export default function MustLoginMessage({ text }) {
  return (
    <div className="bg-red-900 p-2 text-subtleWhite font-bold border-2 border-yellow-300 text-center my-2 max-w-2xl mx-auto rounded-2xl">
      {`To avoid spam, users must sign in to ${text}`}
    </div>
  );
}
