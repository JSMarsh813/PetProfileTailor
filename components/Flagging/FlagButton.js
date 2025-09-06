import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

export default function FlagButton({
  content,
  onClick,
  userHasAlreadyReported,
  userIsTheCreator,
}) {
  const flaggedColor = userHasAlreadyReported ? "red" : "white";

  return (
    <button
      type="button"
      className="ml-2 mr-6 w-full group flex items-center hover:bg-blue-400"
      onClick={() => onClick(content)}
    >
      <FontAwesomeIcon
        icon={faFlag}
        className="text-xl ml-3 mr-2"
        color={flaggedColor}
      />
      <span>Report</span>
    </button>
  );
}
