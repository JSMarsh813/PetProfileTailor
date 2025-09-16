import FlagReport from "@/models/FlagReport";

import dbConnect from "@utils/db";
import Names from "@models/Names";
import NameLikes from "@/models/NameLikes";
import { notFound } from "next/navigation";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";
import SingleListing from "@components/ShowingListOfContent/SingleListing";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

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

  let userLiked = [];

  if (session?.user) {
    const likedDoc =
      (await leanWithStrings(
        NameLikes.findOne({
          userId: userId,
          nameId: nameData._id,
        }),
      )) || null;

    if (likedDoc) {
      userLiked = [likedDoc.nameId.toString()];
    }
  }

  return (
    <div className="mx-2 mt-6  bg-red-300">
      {nameData && (
        <SingleListing
          singleContent={nameData}
          key={nameData._id}
          dataType="names"
          signedInUsersId={session.user.id}
          userLiked={userLiked}
        />
      )}
    </div>
  );
}
