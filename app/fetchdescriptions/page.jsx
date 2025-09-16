import mongoose from "mongoose";
import NameLikes from "@/models/NameLikes";
import DescriptionLikes from "@/models/DescriptionLikes";
import FlagReport from "@/models/FlagReport";
import dbConnect from "@utils/db";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";
import CoreListingPageLogic from "@/components/CoreListingPagesLogic";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

export default async function FetchDescriptions() {
  await dbConnect.connect();

  let usersLikedContent = [];

  const session = await getServerSession(serverAuthOptions);

  if (session?.user) {
    const userId = mongoose.Types.ObjectId(session.user.id);

    console.log("session.user.id:", session.user.id, typeof session.user.id);
    // ######## Likes ###############
    usersLikedContent = await leanWithStrings(
      DescriptionLikes.find({ userId }).select("nameId -_id"),
    );
  }

  return (
    <CoreListingPageLogic
      dataType="descriptions"
      usersLikedContent={usersLikedContent}
    />
  );
}
