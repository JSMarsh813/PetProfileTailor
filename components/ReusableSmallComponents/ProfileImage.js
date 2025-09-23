"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProfileImage({
  profileImage,
  className,
  layout,
  width = "200",
  height = "200",
  divStyling,
  href,
}) {
  const [hover, setHover] = useState(false);
  const handleMouseEnterForImage = () => {
    setHover(true);
  };

  const handleMouseLeaveForImage = () => {
    setHover(false);
  };

  const profileImageString = profileImage;
  const hoverProfileImage = hover
    ? profileImageString
    : profileImageString.replace(".gif", ".jpg");

  return (
    <div className={divStyling}>
      <a href={href}>
        <Image
          src={hoverProfileImage?.trimEnd()}
          // remove any trailing spaces
          alt=""
          className={className}
          width={width}
          height={height}
          unoptimized
          onMouseEnter={handleMouseEnterForImage}
          onMouseLeave={handleMouseLeaveForImage}
          style={{
            maxWidth: "100%",
            width: "auto",
            height: "auto",
          }}
        />
      </a>
    </div>
  );
}
