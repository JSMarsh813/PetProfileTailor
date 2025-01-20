import React from "react";

export default function HeadersForNames() {
  return (
    <section
      className="grid grid-cols-1 xl:grid-cols-5 justify-items-center
            x;:gap-4 
          bg-purple-100
          text-darkPurple py-2 lg:px-2 text-base"
    >
      <span> Likes, shares & comments </span>
      <span> Name </span>
      <span> Description </span>
      <span> Tags </span>
      <span> Created By </span>
    </section>
  );
}
