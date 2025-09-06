import React from "react";
import { Field } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";

export default function StyledCheckbox({
  id,
  label,
  description,
  checked = false,
  onChange,
  value,
  className = "",
}) {
  const inputId = id || label;

  return (
    <label
      htmlFor={inputId}
      className="flex items-center space-x-2 cursor-pointer"
    >
      <input
        id={inputId}
        value={value} // important so your handler sees it
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      <span
        className={`
          border-2 border-violet-300 rounded flex items-center justify-center p-[7px]
          transition-colors duration-200
          bg-secondary text-subtleWhite
          peer-checked:bg-yellow-300 peer-checked:text-secondary
          peer-focus:ring-2 peer-focus:ring-yellow-400 peer-focus:outline-none
        `}
      >
        <FontAwesomeIcon icon={faPaw} />
      </span>

      <div className="flex flex-col">
        {label && <span className="text-subtleWhite font-bold">{label}</span>}
        {description && (
          <span className="text-subtleWhite text-sm">{description}</span>
        )}
      </div>
    </label>
  );
}
