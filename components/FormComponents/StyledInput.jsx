import React from "react";

export default function StyledInput({
  className,
  onChange,
  value,
  maxLength,
  type,
  id,
  name,
  label,
}) {
  return (
    <>
      {label && (
        <label
          className="font-bold block mt-4 text-subtleWhite"
          htmlFor={id}
        >
          {label}
        </label>
      )}

      <input
        className={`border bg-darkPurple rounded-2xl text-subtleWhite border-violet-200 p-2 mb-4 outline-none splaceholder-darkPurple ${className}`}
        onChange={onChange}
        value={value}
        maxLength={maxLength}
        type={type}
        id={id}
        name={name}
      />
    </>
  );
}
