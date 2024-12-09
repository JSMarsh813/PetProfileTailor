import { useState } from "react";
import Image from "next/image";

export default function GifHover({
  gifSrc,
  stillImageSrc,
  className,
  layout,
  width,
  height,
  divStyling,
  alt,
}) {
  const [hover, setHover] = useState(false);
  const handleMouseEnterForImage = () => {
    setHover(true);
  };

  const handleMouseLeaveForImage = () => {
    setHover(false);
  };

  return (
    (<div className={divStyling}>
      <Image
        src={hover ? gifSrc : stillImageSrc}
        layout={!layout ? "fill" : layout}
        alt={!alt ? "" : alt}
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
