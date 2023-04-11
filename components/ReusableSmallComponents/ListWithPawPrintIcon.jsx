import React from "react";
import PawPrintIcon from "./iconsOrSvgImages/PawPrintIcon";

function ListWithPawPrintIcon({ text, className }) {
  return (
    <li className={`my-2 ${className}`}>
      <p>
        <PawPrintIcon /> {text}
      </p>
    </li>
  );
}

export default ListWithPawPrintIcon;
