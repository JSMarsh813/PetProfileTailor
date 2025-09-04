import React from "react";

export default function StyledInput({
  className,
  onChange,
  value,
  maxLength,
  type,
  id,
  name,
}) {
  return (
    <input
      className={`border bg-darkPurple text-subtleWhite border-violet-200 p-2 mb-4 outline-none placeholder-darkPurple ${className}`}
      onChange={onChange}
      value={value}
      maxLength={maxLength}
      type={type}
      id={id}
      name={name}
    />
  );
}
