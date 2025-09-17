import { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const DeleteButton = forwardRef(
  ({ content, onDeleteClick, className }, ref) => (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={(e) => onDeleteClick && onDeleteClick(content, e)}
    >
      <FontAwesomeIcon
        icon={faTrashCan}
        className="text-xl w-4 h-4"
      />
      Delete
    </button>
  ),
);
DeleteButton.displayName = "DeleteButton";
export default DeleteButton;
