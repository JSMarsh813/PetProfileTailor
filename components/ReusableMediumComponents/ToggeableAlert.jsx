import React from "react";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";

export default function ToggeableAlert({ text, setToggleState, toggleState }) {
  return (
    <div className="flex text-white pl-2 border-x-2 border-b-2 border-white bg-violet-800 justify-center">
      <p className="self-center">{text}</p>

      <GeneralButton
        text="Close"
        className="mx-4"
        onClick={() => setToggleState(!toggleState)}
      />
    </div>
  );
}
