import FlagReport from "@/models/FlagReport";

import dbConnect from "@utils/db";
import Names from "@models/Names";
import NameLikes from "@/models/NameLikes";
import { notFound } from "next/navigation";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";
import SingleListing from "@components/ShowingListOfContent/SingleListing";
import { leanWithStrings } from "@/utils/mongoDataCleanup";
import NameListingAsSections from "@/components/ShowingListOfContent/NameListingAsSections";

export default async function Postid({ params }) {
  const { name } = params;
  const spaceAddedBackName = decodeURIComponent(name);
  // gets rid of %20, replaces with a space

  const session = await getServerSession(serverAuthOptions);

  const userId = session.user ? session.user.id : "";

  await dbConnect.connect();

  const nameData = await leanWithStrings(
    Names.findOne({
      content: { $regex: new RegExp(`^${spaceAddedBackName}$`, "i") }, // case-insensitive exact match
    })
      .populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      })
      .populate({ path: "tags", select: ["tag"] }),
  );

  if (!nameData) {
    notFound(); // tells Next.js to show the 404 page
  }

  return (
    <div className="mx-2 mt-6">
      {nameData && (
        <NameListingAsSections
          singleContent={nameData}
          dataType="names"
          mode="local"
        />
      )}
    </div>
  );
}
