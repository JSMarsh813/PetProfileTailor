import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function DeleteButton({ content, onDeleteClick }) {
  return (
    <button
      type="button"
      className="ml-2 mr-6 w-full group flex items-center hover:bg-blue-400"
      onClick={() => onDeleteClick(content)}
    >
      <FontAwesomeIcon
        icon={faTrashCan}
        className="text-xl w-4 h-4"
      />
      <span className="ml-1">Delete</span>
    </button>
  );
}
