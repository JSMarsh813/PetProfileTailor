import dbConnect from "@utils/db";

import NameLikes from "@models/NameLikes";
import FlagReport from "@models/FlagReport";
import mongoose from "mongoose";

import CoreListingPageLogic from "@/components/CoreListingPagesLogic";
import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";

export default async function FetchNames() {
  await dbConnect.connect();

  let usersLikedContent = [];

  let contentUserReported = [];

  let contentUserSuggestedEdits = [];

  const session = await getServerSession(serverAuthOptions);

  if (session) {
    const userId = mongoose.Types.ObjectId(session.user.id);

    console.log("session.user.id:", session.user.id, typeof session.user.id);
    // ######## Likes ###############
    const likes = await NameLikes.find({ userId }).select("nameId -_id");
    usersLikedContent = likes.map((l) => l.nameId.toString());

    // ############## Reports ################

    const reports = await FlagReport.find(
      {
        reportedby: userId,
        status: { $nin: ["dismissed", "deleted", "resolved"] }, // exclude these
        contenttype: "name", // only get reports for descriptions
      },
      { contentid: 1, status: 1, _id: 0 },
    ).lean(); //.lean() makes the query faster by returning plain JS objects.
    console.log("reports from DB:", reports);
    // Extract contentIds into a simple array, convert objectIds to plain strings
    contentUserReported = reports.map((r) => ({
      contentid: r.contentid.toString(),
      status: r.status ?? null,
    }));
    // const contentWithSuggestions
  }

  return (
    <CoreListingPageLogic
      dataType="name"
      sessionFromServer={session}
      usersLikedNamesFromDb={usersLikedContent}
      contentUserReported={contentUserReported}
    />
  );
}
