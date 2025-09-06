import React from "react";

export default function HeadersForNames() {
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-6 justify-items-center 
           
          bg-purple-100
          text-secondary py-2 text-base"
    >
      <span> Likes, Shares, Comments </span>
      <span> Name </span>
      <span> Description </span>
      <span> Tags </span>
      <span> Created By </span>
      <span> Flags </span>
    </section>
  );
}
