import React from "react";

export default function MustLoginMessage({ text }) {
  return (
    <div className="bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 text-center">
      {`To avoid spam, users must sign in to ${text}`}
    </div>
  );
}
