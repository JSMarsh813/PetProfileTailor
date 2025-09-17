"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import { useRef } from "react";
import { useState } from "react";
import GeneralButton from "@components/ReusableSmallComponents/buttons/GeneralButton";
import XSvgIcon from "@components/ReusableSmallComponents/iconsOrSvgImages/XSvgIcon";
import StyledInput from "@components/FormComponents/StyledInput";
import StyledTextarea from "@components/FormComponents/StyledTextarea";
import TagsSelectAndCheatSheet from "@components/FormComponents/TagsSelectAndCheatSheet";
import { useTags } from "@hooks/useTags";
import { useCategoriesForDataType } from "@/hooks/useCategoriesForDataType";

export default function EditName({ dataType, open, onClose, name, onSave }) {
  if (!open) return null;

  const initialTags = name.tags.map((tag) => ({
    label: tag.tag,
    value: tag._id,
  }));

  console.log("dataType in edit name", dataType);
  const { categoriesWithTags, tagList } = useCategoriesForDataType(dataType);
  console.log("dataType in tagList ", tagList);

  const [newName, setName] = useState(name.content);
  const [description, setDescription] = useState(name.notes);
  const { tagsToSubmit, handleSelectChange, handleCheckboxChange } =
    useTags(initialTags);

  const handleSubmit = () => {
    onSave({
      content: newName,
      notes: description,
      tags: tagsToSubmit.map((t) => t.value),
    });
  };

  const panelRef = useRef(null);

  return (
    <Dialog
      open={open}
      onClose={onClose} // Esc key will work
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      initialFocus={panelRef} // optional, for focusing panel for keyboard scroll
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
      />

      {/* Modal panel */}
      <DialogPanel
        className="relative bg-primary rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto p-6 z-50 text-center"
        onClick={(e) => e.stopPropagation()} // prevent clicks from closing
        tabIndex={0} // focusable for arrow key scrolling
      >
        {/* Close button */}
        <div className="flex justify-end">
          <XSvgIcon
            onClickAction={onClose}
            screenReaderText="Close"
          />
        </div>

        <DialogTitle className="text-lg font-bold text-subtleWhite mb-4">
          Edit Content
        </DialogTitle>

        {/* Name */}
        <h4 className="text-subtleWhite mb-2 text-lg">Name</h4>
        <StyledInput
          value={newName}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
        <span className="block text-subtleWhite mb-2">
          {`${40 - newName.length}/40 characters left`}
        </span>

        {/* Description */}
        <h4 className="text-subtleWhite mb-2 text-lg">Description</h4>
        <StyledTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        <span className="block text-subtleWhite mb-2">
          {`${500 - description.length}/500 characters left`}
        </span>

        {/* Tags */}
        <TagsSelectAndCheatSheet
          dataType={dataType}
          tagsToSubmit={tagsToSubmit}
          handleSelectChange={handleSelectChange}
          handleCheckboxChange={handleCheckboxChange}
        />

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <GeneralButton
            text="Cancel"
            warning
            onClick={onClose}
          />
          <GeneralButton
            text="Save"
            subtle
            onClick={handleSubmit}
          />
        </div>
      </DialogPanel>
    </Dialog>
  );
}
