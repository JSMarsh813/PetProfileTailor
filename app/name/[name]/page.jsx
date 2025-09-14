import FlagReport from "@/models/FlagReport";

import dbConnect from "@utils/db";
import Names from "@models/Names";
import NameLikes from "@/models/NameLikes";
import { notFound } from "next/navigation";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";
import { ReportsProvider } from "@/context/ReportsContext";
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
      name: { $regex: new RegExp(`^${spaceAddedBackName}$`, "i") }, // case-insensitive exact match
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

  let report = [];

  if (session) {
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

    report =
      (await leanWithStrings(
        FlagReport.findOne(
          {
            reportedby: userId,
            contenttype: "name",
            contentid: name._id,
            status: { $nin: ["dismissed", "deleted", "resolved"] },
          },
          { contentid: 1, status: 1, _id: 0 }, // only return what is needed
        ),
      )) || [];
    // return [] instead of null if nothing is found
  }

  return (
    <ReportsProvider initialReports={report}>
      <div className="mx-2 mt-6 ">
        <span> something </span>
        {nameData && (
          <SingleListing
            singleContent={nameData}
            key={nameData._id}
            dataType="name"
            signedInUsersId={session.user.id}
            userLiked={userLiked}
          />
        )}
      </div>
    </ReportsProvider>
  );
}
