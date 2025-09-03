import React from "react";

export default function WideCenteredHeader({ heading }) {
  return (
    <h3
      className="text-xl md:text-3xl font-semibold py-4 text-center bg-darkPurple text-subtleWhite
     border-y-2 border-subtleWhite"
    >
      {heading}
    </h3>
  );
}
