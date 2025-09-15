import Select from "react-select";
import dynamic from "next/dynamic";

export default function StyledSelect({
  className,
  id,
  placeholder,
  value = [],
  options = [],
  onChange,
  labelProperty = "label",
  valueProperty = "value",
  isMulti = true,
  isSearchable = true,
}) {
  const Select = dynamic(() => import("react-select"), { ssr: false });
  // disable SSR completely to take care of this hydration Warning: Prop id did not match. Server: "react-select-2-live-region" Client: "react-select-3-live-region" Component Stack:

  // even though its "use client", a "use client" component just means “hydrate me on the client too”, not “skip rendering on the server”

  // so its still prerendered on the server to HTML, When hydration runs, React tries to match that HTML with what the client generates

  // That warning is because react-select generates random IDs (react-select-2-live-region, react-select-3-live-region, etc.) which don’t match between server-render and client-render, thus the hydration warning

  // const Select = dynamic(() => import("react-select"), { ssr: false });

  // react-select uses inputId instead of id???
  const formattedOptions = options.map((opt) => ({
    label: opt[labelProperty],
    value: opt[valueProperty],
  }));
  // Match the selected values with formattedOptions so react-select displays them
  const formattedValue = value.map((val) => ({
    label: val[labelProperty],
    value: val[valueProperty],
  }));

  return (
    <>
      <label
        className="font-bold block mt-4 text-subtleWhite"
        htmlFor="tagsSelect"
      >
        If you type in the tags field, it will filter the tags
      </label>

      <Select
        unstyled
        className="text-subtleWhite border border-subtleWhite bg-secondary rounded-2xl ml-3"
        // className styles the input
        // styles is needed to style the dropdown

        styles={{
          menu: (provided, state) => ({
            ...provided,
            backgroundColor: "rgb(20 2 35)", // dark purple
            color: "rgb(221 214 254)",
            borderRadius: "0.5rem", // optional rounding
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
              ? "#2563EB" // Tailwind bg-blue-600 on hover
              : "rgb(20 2 35)", // dark purple
            color: "rgb(221 214 254)", //subtle white
            cursor: state.isDisabled ? "not-allowed" : "pointer",
          }),
        }}
        id="tagsSelect"
        options={formattedOptions}
        isMulti={isMulti}
        isSearchable={isSearchable}
        value={formattedValue}
        onChange={(selected) => {
          // map react-select’s values back into raw objects
          const normalized = selected
            ? selected.map(
                (s) =>
                  s.original ?? {
                    [labelProperty]: s.label,
                    [valueProperty]: s.value,
                  },
              )
            : [];
          onChange(normalized);
        }}
      />
    </>
  );
}
