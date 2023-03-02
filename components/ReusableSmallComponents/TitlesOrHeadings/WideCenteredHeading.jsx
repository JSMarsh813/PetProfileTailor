import React from "react";

export default function WideCenteredHeader({ heading }) {
  return (
    <h3
      className="text-3xl font-semibold py-4 text-center bg-darkPurple text-amber-300
     border-y-2 border-amber-300"
    >
      {heading}
    </h3>
  );
}
