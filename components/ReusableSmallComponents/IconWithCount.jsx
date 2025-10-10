"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHeart } from "@fortawesome/free-solid-svg-icons";
import Thanks from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/thanks";

export default function IconBadge({
  icon,
  count = 0,
  iconSize = "lg",
  className = "",
}) {
  const iconMap = {
    faBell: faBell,
    faHeart: faHeart,
  };

  //   let fill = count > 0 ? "rgb(255, 0, 0)" : "rgb(221 214 254)";
  //   let faColor = count > 0 ? "text-blue-300" : "text-subtleWhite";
  return (
    <section className={`relative inline-block ${className}`}>
      {icon === "thanks" ? (
        <div className="-ml-2">
          {/* just used for thanks notifications */}
          <Thanks fill={"rgb(221 214 254)"} />
        </div>
      ) : (
        <FontAwesomeIcon
          icon={iconMap[icon]}
          size={iconSize}
          className="text-subtleWhite"
        />
      )}

      {count > 0 && (
        <span className="absolute -top-2 -right-3 text-xs text-subtleWhite px-1 bg-blue-700 rounded-full">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </section>
  );
}
