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

  const nameData = await Names.find({ name: name })
    .populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    })
    .populate({ path: "tags", select: ["tag"] });

  console.log("nameData", nameData);

  let userLiked = [];

  let report = [];

  const categoriesWithTags = await NameCategory.find()
    .populate("tags")
    .sort({ order: 1, _id: 1 });

  if (session) {
    // checking if its been reported by the logged in user

    const likes = (await NameLikes.findOne({ userId, nameId: name._id })) || [];
    userLiked = likes.map((l) => l.nameId.toString());

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

  if (!nameData.length) {
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

  console.log("categoriesWithTags", categoriesWithTags);

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  const likedSetRef = useRef(new Set(userLiked));
  const recentLikesRef = useRef({});

  console.log(" contentid: nameData[0]._id,", nameData[0]._id);

  return (
    <ReportsProvider initialReports={report}>
      <div>
        <NavLayoutwithSettingsMenu
          profileImage={profileImage}
          userName={userName}
          sessionFromServer={sessionFromServer}
        />

        <div className="mx-2 mt-6 ">
          {nameData.length > 0 && (
            <SingleListing
              singleContent={nameData[0]}
              key={nameData[0]._id}
              dataType="name"
              signedInUsersId={sessionFromServer.user.id}
              likedSetRef={likedSetRef}
              recentLikesRef={recentLikesRef}
              categoriesWithTags={categoriesWithTags}
            />
          )}
        </div>
      </div>
    </ReportsProvider>
  );
}
