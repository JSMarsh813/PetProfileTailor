import { useState } from "react";
import Image from "next/image";

export default function ProfileImage({
  profileImage,
  className,
  layout,
  width,
  height,
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
    (<div className={divStyling}>
      <Image
        src={hoverProfileImage}
        layout={!layout ? "fill" : layout}
        alt=""
        className={className}
        width={width}
        height={height}
        unoptimized
        onMouseEnter={handleMouseEnterForImage}
        onMouseLeave={handleMouseLeaveForImage}
        style={{
          maxWidth: "100%",
          height: "auto"
        }} />
    </div>)
  );
}
