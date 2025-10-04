import dbConnect from "@utils/db";
import NameTag from "@/models/NameTag";
import Names from "@models/Name";
import { notFound } from "next/navigation";
import { leanWithStrings } from "@/utils/mongoDataCleanup";
import ContentListing from "@/components/ShowingListOfContent/ContentListing";

import ReturnToPreviousPage from "@/components/ReusableSmallComponents/buttons/ReturnToPreviousPage";

export default async function Postid({ params }) {
  const { name } = await params;
  const spaceAddedBackName = decodeURIComponent(name);
  // gets rid of %20, replaces with a space

  await dbConnect.connect();

  const nameData = await leanWithStrings(
    Names.findOne({
      content: { $regex: new RegExp(`^${spaceAddedBackName}$`, "i") }, // case-insensitive exact match
    })
      .populate({
        path: "createdBy",
        select: ["name", "profileName", "profileImage"],
      })
      .populate({ path: "tags", select: ["tag"] }),
  );

  if (!nameData) {
    notFound(); // tells Next.js to show the 404 page
  }

  return (
    <div className="mx-2 mt-6">
      <ReturnToPreviousPage
        text="return to fetch names"
        href="/fetchnames"
      />

      {nameData && (
        <ContentListing
          singleContent={nameData}
          dataType="names"
          mode="local"
          className="mt-4"
        />
      )}
    </div>
  );
}
