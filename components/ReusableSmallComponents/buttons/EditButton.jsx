import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

// If you pass a regular functional component to Headless UI without forwardRef, React can’t attach a ref to it. That breaks:

// Keyboard navigation
// Focus highlighting
// Headless UI’s internal logic for menu behavior

// By using forwardRef, you let React “forward” the ref from Headless UI to your actual DOM element inside your custom component:
//This way, Headless UI can focus the <button> when navigating via keyboard, and your menu behaves as expected. So forwardRef allows Headless UI to manage focus properly
const EditButton = forwardRef(
  ({ content, onupdateEditState, className }, ref) => (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={(e) => onupdateEditState && onupdateEditState(content, e)}
    >
      <FontAwesomeIcon
        icon={faPencil}
        className="text-xl w-4 h-4 mr-2"
      />
      <span>Edit</span>
    </button>
  ),
);
EditButton.displayName = "EditButton";
export default EditButton;
