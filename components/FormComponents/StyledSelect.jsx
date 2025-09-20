"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const NoSSRSelect = dynamic(() => import("react-select"), { ssr: false });

// disable SSR completely to take care of this hydration Warning: Prop id did not match. Server: "react-select-2-live-region" Client: "react-select-3-live-region" Component Stack:

// even though its "use client", a "use client" component just means “hydrate me on the client too”, not “skip rendering on the server”

// so its still prerendered on the server to HTML, When hydration runs, React tries to match that HTML with what the client generates

// That warning is because react-select generates random IDs (react-select-2-live-region, react-select-3-live-region, etc.) which don’t match between server-render and client-render, thus the hydration warning

// const Select = dynamic(() => import("react-select"), { ssr: false });

export default function StyledSelect({
  id,
  options = [],
  value = [],
  onChange,
  labelProperty = "label",
  valueProperty = "value",
  isMulti = true,
  isSearchable = true,
}) {
  // create a stable array of react-select-friendly objects
  const formattedOptions = useMemo(
    () =>
      options.map((opt) => ({
        ...opt, // keep original fields (_id, etc.)
        label: opt[labelProperty],
        value: opt[valueProperty],
      })),
    [options, labelProperty, valueProperty],
  );

  // Match the selected values with formattedOptions so react-select displays them
  // map current value objects to their matching formatted option objects
  // this preserves reference equality so react-select won't flicker

  const formattedValue = useMemo(
    () =>
      value
        .map((v) => formattedOptions.find((o) => o._id === v._id))
        // Find the actual objects inside formattedOptions
        .filter(Boolean),
    [value, formattedOptions],
  );

  return (
    <NoSSRSelect
      inputId={id}
      unstyled
      className="text-subtleWhite border border-subtleWhite bg-secondary rounded-2xl ml-3"
      // className styles the input
      // styles is needed to style the dropdown
      options={formattedOptions}
      value={formattedValue}
      isMulti={isMulti}
      isSearchable={isSearchable}
      styles={{
        menu: (provided) => ({
          ...provided,
          backgroundColor: "rgb(20 2 35)", // dark purple
          color: "rgb(221 214 254)",
          borderRadius: "0.5rem",
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? "#2563EB" : "rgb(20 2 35)", // Tailwind bg-blue-600 on hover :  dark purple
          color: "rgb(221 214 254)", //subtle white
          cursor: state.isDisabled ? "not-allowed" : "pointer",
        }),
      }}
      onChange={(selected) => {
        // react-select gives you the same objects from formattedOptions
        // strip the label/value props back down to your raw data if you like aka  // map react-select’s values back into raw objects
        const normalized = (selected || []).map((s) => {
          const { label, value, ...rest } = s;
          return rest; // rest still contains _id, category, etc.
        });
        onChange(normalized);
      }}
    />
  );
}
