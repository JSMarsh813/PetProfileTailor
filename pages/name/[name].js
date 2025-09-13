import React, { useRef } from "react";
import Layout from "@components/NavBar/NavLayoutwithSettingsMenu";
import Namelisting from "@components/ShowingListOfContent/Namelisting";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import SingleListing from "@components/ShowingListOfContent/SingleListing";
import FlagReport from "@/models/FlagReport";
import { useSwrPagination } from "@/hooks/useSwrPagination";

import NavLayoutwithSettingsMenu from "@components/NavBar/NavLayoutwithSettingsMenu";
import { ReportsProvider } from "@context/ReportsContext";

import dbConnect from "@utils/db";
import Names from "@models/Names";
import NameCategory from "@/models/NameCategory";
import NameLikes from "@/models/NameLikes";

export const getServerSideProps = async (context) => {
  //allows us to grab the dynamic value from the url
  const name = context.params.name;

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  const userId = session ? session.user.id : "";

  await dbConnect.connect();

  const nameData = await Names.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive exact match
  })
    .populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    })
    .populate({ path: "tags", select: ["tag"] });

  if (!nameData) {
    return { notFound: true }; // Next.js 404
  }

  let userLiked = [];

  let report = [];

  const categoriesWithTags = await NameCategory.find()
    .populate("tags")
    .sort({ order: 1, _id: 1 });

  if (session) {
    const likedDoc =
      (await NameLikes.findOne({ userId: userId, nameId: nameData._id })) ||
      null;
    console.log("likeddoc", likedDoc);
    if (likedDoc) {
      userLiked = [likedDoc.nameId.toString()];
    }

    report =
      (await FlagReport.findOne(
        {
          reportedby: userId,
          contenttype: "name", // restrict to 'name' reports
          contentid: name._id, // only this name
          status: { $nin: ["dismissed", "deleted", "resolved"] }, // exclude these
        },
        { contentid: 1, status: 1, _id: 0 }, // only return what you need
      ).lean()) || [];
    // return [] instead of null if nothing is found
  }

  if (!nameData) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        categoriesWithTags: JSON.parse(JSON.stringify(categoriesWithTags)),
        nameData: JSON.parse(JSON.stringify(nameData)),
        sessionFromServer: session,
        userLiked,
        report,
      },
    };
  }
};

export default function Postid({
  sessionFromServer,
  nameData,
  report,
  userLiked,
  categoriesWithTags,
}) {
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  const likedSetRef = useRef(new Set(userLiked));
  const recentLikesRef = useRef({});

  return (
    <ReportsProvider initialReports={report}>
      <div>
        <NavLayoutwithSettingsMenu
          profileImage={profileImage}
          userName={userName}
          sessionFromServer={sessionFromServer}
        />

        <div className="mx-2 mt-6 ">
          {nameData && (
            <SingleListing
              singleContent={nameData}
              key={nameData._id}
              dataType="name"
              signedInUsersId={sessionFromServer.user.id}
              likedSetRef={likedSetRef}
              recentLikesRef={recentLikesRef}
              categoriesWithTags={categoriesWithTags}
            />
          )}
          {/* {nameData.length === 0 && <p> the name </p>} */}
        </div>
      </div>
    </ReportsProvider>
  );
}
