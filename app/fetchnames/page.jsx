import dbConnect from "@utils/db";

import NameLikes from "@models/NameLikes";
import FlagReport from "@models/FlagReport";
import mongoose from "mongoose";

import CoreListingPageLogic from "@/components/CoreListingPagesLogic";
import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

export default async function FetchNames() {
  await dbConnect.connect();

  let usersLikedContent = [];

  let contentUserReported = [];

  let contentUserSuggestedEdits = [];

  const session = await getServerSession(serverAuthOptions);

  if (session?.user) {
    const userId = mongoose.Types.ObjectId(session.user.id);

    console.log("session.user.id:", session.user.id, typeof session.user.id);
    // ######## Likes ###############
    usersLikedContent = await leanWithStrings(
      NameLikes.find({ userId }).select("nameId -_id"),
    );

    // ############## Reports ################

    const reports = await leanWithStrings(
      FlagReport.find(
        {
          reportedby: userId,
          status: { $nin: ["dismissed", "deleted", "resolved"] }, // exclude these
          contenttype: "name", // only get reports for descriptions
        },
        { contentid: 1, status: 1, _id: 0 },
      ),
    );
    console.log("reports from DB:", reports);

    contentUserReported = reports.map((r) => ({
      status: r.status ?? null,
    }));
  }

  return (
    <CoreListingPageLogic
      dataType="name"
      sessionFromServer={session}
      usersLikedContent={usersLikedContent}
      contentUserReported={contentUserReported}
    />
  );
}
