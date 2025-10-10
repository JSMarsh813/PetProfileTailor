import React from "react";
import IconBadge from "../IconWithCount";

function IconOpenCloseButton({
  state,
  text,
  value,
  className,
  setState,

  icon,
  unreadCount,
}) {
  return (
    <button
      className={`hover:rounded-2xl
    text-subtleWhite  font-bold py-2 px-4 
    hover:bg-blue-500
    hover:border-blue-600 text-base
    ${state === value && "border-b-4 border-subtleWhite"}
    ${className} `}
      onClick={() => setState(value)}
    >
      {/* bg-subtleBackground  border-b-4 border-subtleWhite  */}
      <div className="flex items-center">
        <p className="whitespace-normal break-words mr-2">{text}</p>

        <IconBadge
          icon={icon}
          count={unreadCount}
        />
      </div>
    </button>
  );
}

export default IconOpenCloseButton;
