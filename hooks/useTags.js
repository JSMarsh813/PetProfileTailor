import { useState } from "react";

export function useTags(initial = []) {
  const [tagsToSubmit, setTagsToSubmit] = useState(initial);

  const handleSelectChange = (selected) => {
    if (!selected) return setTagsToSubmit([]);

    setTagsToSubmit((prev) => {
      const prevIds = prev.map((t) => t.value);

      // Append new tags in the order they appear in 'selected'
      const newTags = [...prev];

      selected.forEach((s) => {
        if (!prevIds.includes(s.value)) {
          newTags.push(s);
        }
      });

      // Filter out tags that were deselected
      return newTags.filter((t) => selected.some((s) => s.value === t.value));
    });
  };

  const handleCheckboxChange = ({ id, label, checked }) => {
    setTagsToSubmit((prev) => {
      if (checked) {
        // append to the end if not already in array
        if (!prev.some((t) => t.value === id)) {
          return [...prev, { label, value: id }];
        }
        return prev;
      } else {
        // remove deselected
        return prev.filter((t) => t.value !== id);
      }
    });
  };

  return { tagsToSubmit, handleSelectChange, handleCheckboxChange };
}
