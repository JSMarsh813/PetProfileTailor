"use client";

import NewNameWithTagsData from "@components/AddingNewData/addingName";
import PageTitleWithImages from "@components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";
import { useSession } from "next-auth/react";
import CheckIfContentExists from "@/components/AddingNewData/CheckIfContentExists";

function AddNewNameWithTags() {
  const { data: session } = useSession();

  return (
    <div className="min-h-fit  overflow-hidden text-white w-full">
      <PageTitleWithImages
        imgSrc="bg-[url('https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/Z5QQMNJZGJDSVJFNHHR3QYNMCE.jpg')] "
        title="Find A"
        title2="Name"
      />

      <div className="mx-auto mt-4 flex justify-center text-center flex-col">
        <CheckIfContentExists
          apiString="/api/names/check-if-content-exists/"
          disabled={false}
          contentType="names"
          showFullContent={true}
        />
      </div>
    </div>
  );
}

export default AddNewNameWithTags;
