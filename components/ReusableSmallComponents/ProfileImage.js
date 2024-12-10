import { useState } from "react";
import Image from "next/image";

export default function ProfileImage({
  profileImage,
  className,
  layout,
  width = "200",
  height = "200",
  divStyling,
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
      <Image
        src={hoverProfileImage}
        alt=""
        className={className}
        width={width}
        height={height}
        unoptimized
        onMouseEnter={handleMouseEnterForImage}
        onMouseLeave={handleMouseLeaveForImage}
      />
    </div>
  );
}
