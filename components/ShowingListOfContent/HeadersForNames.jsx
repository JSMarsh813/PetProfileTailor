import React from "react";

export default function HeadersForNames() {
  return (
    <section
      className="grid lg:grid-cols-5
      grid-cols-2
      sm:grid-cols-3
       lg:gap-4 
          bg-purple-100
          text-darkPurple py-2 lg:px-2 text-base"
    >
      <span> Like </span>
      <span> Name </span>
      <span> Description </span>
      <span> Tags </span>
      <span> Created By </span>
    </section>
  );
}
