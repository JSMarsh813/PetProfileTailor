import React from "react";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";

export default function ToggeableAlert({ text, setToggleState, toggleState }) {
  return (
    <div className="p-4 bg-red-900 text-subtleWhite text-center rounded-2xl mb-2 max-w-[90%] mx-auto border-2 border-yellow-200">
      <p className="self-center">{text}</p>

      <GeneralButton
        text="Close"
        className="mx-auto"
        onClick={() => setToggleState(!toggleState)}
      />
    </div>
  );
}
