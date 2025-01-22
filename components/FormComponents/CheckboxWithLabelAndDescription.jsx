import React from "react";
import { Label, Description, Field } from "@headlessui/react";

export default function CheckboxWithLabelAndDescription({
  title,
  description,
  handleFlagCategoriesState,
}) {
  return (
    <Field className="flex my-4">
      {/* className ==> "group" is needed for the Checkbox component, otherwise the checkbox svg will not appear */}
      <input
        value={title}
        className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500 mt-2"
        onChange={handleFlagCategoriesState}
        type="checkbox"
        aria-label="checkboxes-for-suggestion-categoreis"
      />

      <div className="ml-2 text-white">
        <Label className="font-bold text-lg ">{title}</Label>
        <Description>{description}</Description>
      </div>
    </Field>
  );
}
