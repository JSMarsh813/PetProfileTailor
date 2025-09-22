"use client";

import NewNameWithTagsData from "@components/AddingNewData/addingName";
import PageTitleWithImages from "@components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import { useSession } from "next-auth/react";

function AddNewNameWithTags() {
  const { data: session } = useSession();

  return (
    <div className=" h-full text-white w-full">
      <PageTitleWithImages
        imgSrc="bg-[url('https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/Z5QQMNJZGJDSVJFNHHR3QYNMCE.jpg')] "
        title="Add A"
        title2="Name"
      />

      <div className="mx-auto mt-4 flex justify-center text-center flex-col">
        {!session && (
          <div className="bg-red-800 p-2 text-white font-bold border-2 border-yellow-300 text-center">
            To avoid spam, users must sign in to add names
          </div>
        )}

        <NewNameWithTagsData />
      </div>
    </div>
  );
}

export default AddNewNameWithTags;
