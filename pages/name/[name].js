import React, { useEffect, useState } from "react";
import Layout from "../../components/NavBar/NavLayoutwithSettingsMenu";
import Namelisting from "../../components/ShowingListOfContent/Namelisting";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import NameListingAsSections from "../../components/ShowingListOfContent/NameListingAsSections";

import NavLayoutwithSettingsMenu from "../../components/NavBar/NavLayoutwithSettingsMenu";

import dbConnect from "../../utils/db";
import Names from "../../models/Names";

export const getServerSideProps = async (context) => {
  //allows us to grab the dynamic value from the url
  const name = context.params.name;

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  const UserId = session ? session.user.id : "";

  await dbConnect.connect();

  const nameData = await Names.find({ name: name })
    .populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    })
    .populate({ path: "tags", select: ["tag"] });

  if (!nameData.length) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        nameData: JSON.parse(JSON.stringify(nameData)),
        sessionFromServer: session,
      },
    };
  }
};

export default function Postid({ sessionFromServer, nameData }) {
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  return (
    <div>
      <NavLayoutwithSettingsMenu
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <div className="mx-2">
        <section
          className=" grid md:grid-cols-5
                          grid-cols-3 gap-4 
                          bg-purple-100
                          text-secondary p-2"
        >
          <span> Like </span>
          <span> Name </span>
          <span> Description</span>
          <span> Tags </span>
          <span> Created By </span>
        </section>

        <NameListingAsSections
          name={nameData[0]}
          key={nameData._id}
          sessionFromServer={sessionFromServer}
        />
      </div>
    </div>
  );
}
