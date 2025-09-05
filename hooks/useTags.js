import { useState } from "react";

export function useTags(initial = []) {
  const [tagsToSubmit, setTagsToSubmit] = useState(initial);

  const handleSelectChange = (selected) => {
    const normalized = selected
      ? selected.map((tag) => ({
          label: tag.label,
          value: tag.value, // _id
          key: tag.value,
        }))
      : [];
    setTagsToSubmit(normalized);
  };

  const handleCheckboxChange = ({ id, value, checked }) => {
    setTagsToSubmit((prev) =>
      checked
        ? prev.some((tag) => tag.value === id)
          ? prev
          : [...prev, { label: value, value: id, key: id }]
        : prev.filter((tag) => tag.value !== id),
    );
  };

  return {
    tagsToSubmit,
    setTagsToSubmit,
    handleSelectChange,
    handleCheckboxChange,
  };
}
