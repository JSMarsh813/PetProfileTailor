// components/FormInput.jsx
import React from "react";

const FormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  maxLength,
  autoFocus,
  register,
  validation,
  error,
  className = "",
}) => {
  return (
    <div className="mb-4 ">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 font-medium text-subtleWhite"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className={`border bg-darkPurple text-subtleWhite border-violet-200 p-2 mb-4 outline-none placeholder-darkPurple min-w-[400px] lg:w-[30rem] ${className} `}
        {...register(id, validation)}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormInput;
