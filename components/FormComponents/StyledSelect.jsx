import Select from "react-select";

export default function StyledSelect({
  className,
  id,
  placeholder,
  value = [],
  options = [],
  onChange,
  labelProperty = "tag",
  valueProperty = "_id",
}) {
  const formattedOptions = options.map((opt) => ({
    label: opt[labelProperty],
    value: opt[valueProperty],
  }));
  // Transform value (same shape as options)
  const formattedValue = value.map((v) => ({
    label: v[labelProperty] ?? v.label,
    value: v[valueProperty] ?? v.value,
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
      isMulti
      isSearchable
      value={formattedValue}
      placeholder="If you type in the tags field, it will filter the tags"
      onChange={(selected) => {
        // normalize output for parent
        const normalized = selected
          ? selected.map((item) => ({
              label: item.label,
              value: item.value,
            }))
          : [];
        onChange(normalized);
      }}
    />
  );
}
