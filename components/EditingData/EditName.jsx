import { Dialog, DialogPanel, DialogTitle, panelRef } from "@headlessui/react";
import { useState } from "react";
import GeneralButton from "../ReusableSmallComponents/buttons/GeneralButton";
import XSvgIcon from "../ReusableSmallComponents/iconsOrSvgImages/XSvgIcon";
import StyledInput from "../FormComponents/StyledInput";
import StyledTextarea from "../FormComponents/StyledTextarea";
import TagsSelectAndCheatSheet from "../FormComponents/TagsSelectAndCheatSheet";
import { useTags } from "@hooks/useTags";

export default function EditName({
  open,
  onClose,
  name,
  onSave,
  categoriesWithTags,
}) {
  if (!open) return null;

  const initialTags = name.tags.map((tag) => ({
    label: tag.tag,
    value: tag._id,
  }));

  const [newName, setName] = useState(name.name);
  const [description, setDescription] = useState(name.description);
  const { tagsToSubmit, handleSelectChange, handleCheckboxChange } =
    useTags(initialTags);

  const handleSubmit = () => {
    onSave({
      name: newName,
      description,
      tags: tagsToSubmit.map((t) => t.value),
    });
  };

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
          Edit Name
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
          categoriesWithTags={categoriesWithTags}
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
