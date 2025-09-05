import { useState } from "react";

export function useTags(initial = []) {
  const [tagsToSubmit, setTagsToSubmit] = useState(initial);

  const handleSelectChange = (selected) => {
    setTagsToSubmit(selected || []);
  };

  const handleCheckboxChange = ({ id, label, checked }) => {
    setTagsToSubmit((prev) => {
      if (checked) {
        if (!prev.some((t) => t.value === id))
          return [...prev, { label, value: id }];
        return prev;
      } else {
        return prev.filter((t) => t.value !== id);
      }
    });
  };

  return { tagsToSubmit, handleSelectChange, handleCheckboxChange };
}
