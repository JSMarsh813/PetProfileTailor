import React from "react";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";

export default function ToggeableAlert({ text, setToggleState, toggleState }) {
  return (
    <div className="p-4 bg-red-700 text-white text-center ">
      <p className="self-center">{text}</p>

      <GeneralButton
        text="Close"
        className="mx-auto"
        onClick={() => setToggleState(!toggleState)}
      />
    </div>
  );
}
