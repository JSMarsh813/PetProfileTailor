import React from "react";
import PawPrintIcon from "./iconsOrSvgImages/PawPrintIcon";

function ListWithPawPrintIcon({ text }) {
  return (
    <li className="my-2">
      <p>
        <PawPrintIcon /> {text}
      </p>
    </li>
  );
}

export default ListWithPawPrintIcon;
