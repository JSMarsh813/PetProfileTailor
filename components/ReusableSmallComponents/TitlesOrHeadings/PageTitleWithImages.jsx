import React from "react";

export default function PageTitleWithImages({ imgSrc, title, title2 }) {
  return (
    <div
      className={`h-32 mb-4 bg-no-repeat relative bg-cover ${imgSrc} relative  mx-auto`}
      style={{
        backgroundPosition: "80%",
        backgroundImage: `url("/dogheaderfreewebheaders.jpg")`,
        height: "200px",
      }}
    >
      <h3
        className="text-center pt-2 
     mx-auto  h-32
    text-4xl text-white bg-secondary
    font-semibold
     absolute inset-0 my-auto"
        style={{
          background: "hsla(240, 80%, 60%, 0.5)",
          backdropFilter: "blur(20px)",
        }}
      >
        {title}

        {title2 && <span className="block -mt-2">{title2}</span>}
      </h3>
    </div>
  );
}
