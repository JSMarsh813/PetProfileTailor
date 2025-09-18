import dbConnect from "@utils/db";

import NameLikes from "@models/NameLikes";
import mongoose from "mongoose";

import CoreListingPageLogic from "@/components/CoreListingPagesLogic";
import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

export default async function FetchNames() {
  await dbConnect.connect();

  let usersLikedContent = [];

  let contentUserSuggestedEdits = [];

  const session = await getServerSession(serverAuthOptions);

  if (session?.user) {
    const userId = mongoose.Types.ObjectId(session.user.id);

    console.log("session.user.id:", session.user.id, typeof session.user.id);
    // ######## Likes ###############
    usersLikedContent = await leanWithStrings(
      NameLikes.find({ userId }).select("nameId -_id"),
    );
  }

  return (
    <CoreListingPageLogic
      dataType="names"
      sessionFromServer={session}
      usersLikedContent={usersLikedContent}
    />
  );
}
