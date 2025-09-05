import Select from "react-select";

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
    <Select
      unstyled
      className="text-subtleWhite border border-subtleWhite bg-darkPurple "
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
      id="nameTags"
      options={formattedOptions}
      isMulti={isMulti}
      isSearchable={isSearchable}
      value={formattedValue}
      placeholder="If you type in the tags field, it will filter the tags"
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
  );
}
