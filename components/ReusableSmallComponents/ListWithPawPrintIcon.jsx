import React from "react";
import PawPrintIcon from "./iconsOrSvgImages/PawPrintIcon";

function ListWithPawPrintIcon({ text, className }) {
  return (
    <li className={`my-3 ${className} flex`}>
      <p>
        <PawPrintIcon />
      </p>
      <p>{text}</p>
    </li>
  );
}

export default ListWithPawPrintIcon;
