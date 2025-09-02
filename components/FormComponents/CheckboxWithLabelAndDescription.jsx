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
        className="h-4 w-4 rounded border-violet-300 text-amber-300 focus:ring-amber-600  group-hover:bg-subtleWhite bg-darkPurple"
        onChange={handleFlagCategoriesState}
        type="checkbox"
        aria-label="checkboxes-for-suggestion-categoreis"
      />

      <div className="ml-2 text-subtleWhite">
        <Label className="font-bold text-lg ">{title}</Label>
        <Description>{description}</Description>
      </div>
    </Field>
  );
}
