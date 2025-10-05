"use client";

import React from "react";
import { formatDistanceStrict } from "date-fns";
import Link from "next/link";
import ProfileImage from "../ReusableSmallComponents/ProfileImage";
import Thanks from "@components/ReusableSmallComponents/iconsOrSvgImages/svgImages/thanks";

export default function ThanksContentListing({ singleContent }) {
  const { thanksBy, contentType, nameId, descriptionId, messages, createdAt } =
    singleContent;

  const profileLink = `${
    process.env.NEXT_PUBLIC_BASE_FETCH_URL
  }profile/${thanksBy.profileName.toLowerCase()}`;

  const currentDate = new Date();

  const contentLink =
    contentType === "names"
      ? `/name/${nameId?.content}`
      : `/description/${descriptionId?._id}`;
  let descriptionContent = "";

  if (descriptionId?.content) {
    const content = descriptionId.content;
    const slicedContent = content.slice(0, 60);
    const dotsOrNot = content.length > 60 ? "..." : "";
    descriptionContent = `${slicedContent}${dotsOrNot}`;
  }

  return (
    <div className="hover:bg-secondary rounded-2xl px-2 subtle-White ml-5 flex my-2">
      <span className="mr-4 mt-3">
        {" "}
        <Thanks fill="#ec4899" />
      </span>
      <section>
        <Link href={contentLink}>
          <ProfileImage
            divStyling="h-8 w-8 mr-4 mt-3 mb-2"
            profileImage={thanksBy.profileImage}
            layout="responsive"
            className="rounded-2xl"
            width={40}
            height={40}
            href={profileLink}
          />

          {/* flex-1 min-w-0 use remaining space but still wrap. Without min-w-0, text might overflow instead of wrapping.*/}
          <p className="flex">
            <Link
              href={profileLink}
              className=""
            >
              <span className="font-bold font-white break-words mr-1  hover:underline">
                {" "}
                {thanksBy.name}{" "}
              </span>{" "}
            </Link>
            {`thanked you  •   ${formatDistanceStrict(
              new Date(createdAt),
              currentDate,
            )}`}
          </p>

          <ul className="my-2">
            {" "}
            {messages.map((message) => (
              <li key={message}>{`• ${message}`}</li>
            ))}
          </ul>

          <p>
            {" "}
            {contentType === "names" ? nameId.content : descriptionContent}
          </p>
        </Link>
      </section>
    </div>
  );
}
