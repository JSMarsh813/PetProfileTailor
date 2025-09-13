import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import dbConnect from "@utils/db";
import Category from "@models/NameCategory";

import NameLikes from "@models/NameLikes";
import FlagReport from "@models/FlagReport";
import mongoose from "mongoose";

import CoreListingPageLogic from "@/components/CoreListingPagesLogic";

//getkey: accepts the index of the current page, as well as the data from the previous page.

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  await dbConnect.connect();

  //grabbing category's

  const data = await Category.find()
    .populate("tags")
    .sort({ order: 1, _id: 1 });
  // _id:1 is there just in case a category doesn't have an order property, it will appear at the end

  // grabbing names by logged in user

  let usersLikedContent = [];

  let contentUserReported = [];

  let contentUserSuggestedEdits = [];

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

  // MongoDB documents (from Mongoose) are not plain JavaScript objects they have extra methods like .save, ect, but Next.JS needs JSON-serializable objects
  // thus the JSON.parse(JSON.stringify)
  return {
    props: {
      categoriesWithTags: JSON.parse(JSON.stringify(data)),
      sessionFromServer: session,
      usersLikedNamesFromDb: usersLikedContent,
      contentUserReported,
    },
  };
};

export default function FetchNames({
  categoriesWithTags,
  sessionFromServer,
  usersLikedNamesFromDb,
  contentUserReported,
}) {
  return (
    <CoreListingPageLogic
      dataType="name"
      categoriesWithTags={categoriesWithTags}
      sessionFromServer={sessionFromServer}
      usersLikedNamesFromDb={usersLikedNamesFromDb}
      contentUserReported={contentUserReported}
    />
  );
}
