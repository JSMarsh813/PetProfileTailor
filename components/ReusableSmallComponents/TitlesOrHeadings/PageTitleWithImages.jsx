import React from "react";

export default function PageTitleWithImages({ imgSrc, title, title2 }) {
  return (
    <div className={`h-32 mb-4 bg-repeat-x bg-contain ${imgSrc}`}>
      <h3
        className="text-center pt-2 
    w-96 mx-auto  h-32
    text-4xl text-yellow-300   bg-darkPurple
    font-semibold
    border-y-4 border-amber-300"
        style={{
          marginBottom: "-90px",
          background: "hsla(260, 90%, 60%, 0.6)",
          backdropFilter: "blur(20px)",
        }}
      >
        {title}

        {title2 && <span className="block -mt-2">{title2}</span>}
      </h3>
    </div>
  );
}
