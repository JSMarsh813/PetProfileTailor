import React from "react";
import ShowTime from "./ShowTime";
import Link from "next/link";
import Image from "next/image";
import ProfileImage from "./ProfileImage";

export default function PostersImageUsernameProfileName({
  postersProfileImage,
  postersName,
  profileName,
  postDate,
  showtime,
}) {
  return (
    <Link
      href={`${
        process.env.NEXT_PUBLIC_BASE_FETCH_URL
      }/profile/${profileName.toLowerCase()}`}
      legacyBehavior
    >
      <div className="author flex items-center -ml-3 my-3">
        <ProfileImage
          divStyling="w-12 mr-2"
          profileImage={postersProfileImage}
          layout="responsive"
          className="object-cover rounded-full mx-4 shadow"
          width={100}
          height={100}
        />

        <h2 className="text-sm tracking-tighter">
          <a
            className="font-bold block text-left"
            href="#"
          >
            By {postersName}
          </a>

          <a
            className=""
            href="#"
          >
            @{profileName}
          </a>
          {postDate && showtime == true && <ShowTime postDate={postDate} />}
        </h2>
      </div>
    </Link>
  );
}
