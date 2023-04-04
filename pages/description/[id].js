import React, { useEffect, useState } from "react";
import Layout from "../../components/NavBar/NavLayoutwithSettingsMenu";
import Namelisting from "../../components/ShowingListOfContent/Namelisting";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import NameListingAsSections from "../../components/ShowingListOfContent/NameListingAsSections";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentDots,
  faFaceGrinWink,
  faUserTie,
  faCircleChevronDown,
  faLocationDot,
  faRankingStar,
  faUserPlus,
  faEnvelopeOpenText,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import NavLayoutwithSettingsMenu from "../../components/NavBar/NavLayoutwithSettingsMenu";
import DescriptionListingAsSections from "../../components/ShowingListOfContent/DescriptionListingAsSections";
import HeadersForDescriptions from "../../components/ShowingListOfContent/HeadersForDescriptions";
import PageTitleWithImages from "../../components/ReusableSmallComponents/TitlesOrHeadings/PageTitleWithImages";

import dbConnect from "../../config/connectmongodb";
import Descriptions from "../../models/description";
import DescriptionTag from "../../models/descriptiontag";
const ObjectId = require("mongodb").ObjectId;

export const getServerSideProps = async (context) => {
  //allows us to grab the dynamic value from the url
  const id = context.params.id;

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // let descriptionResponse = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/description/getASpecificDescriptionById/` +
  //     id
  // );
  // let descriptionData = await descriptionResponse.json();

  dbConnect();

  const descriptionId = ObjectId(context.params.id);

  let descriptionData = await Descriptions.findById(descriptionId)
    .populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    })
    .populate({ path: "tags", select: ["tag"] });

  if (!descriptionData) {
    return {
      notFound: true,
    };
  } else {
    // let descriptionTagList = await fetch(
    //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/descriptiontag`
    // );
    // let descriptionTagData = await descriptionTagList.json();

    const descriptionTagData = await DescriptionTag.find();

    let tagListProp = descriptionTagData
      .map((tag) => tag.tag)
      .reduce((sum, value) => sum.concat(value), []);

    return {
      props: {
        description: JSON.parse(JSON.stringify(descriptionData)),
        sessionFromServer: session,
        tagList: JSON.parse(JSON.stringify(tagListProp)),
      },
    };
  }
};

export default function Postid({ sessionFromServer, description, tagList }) {
  //for Nav menu profile description and image
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }

  //end of section for nav menu

  return (
    <div>
      <NavLayoutwithSettingsMenu
        profileImage={profileImage}
        userName={userName}
      />

      <div className="mx-2">
        <HeadersForDescriptions />

        <DescriptionListingAsSections
          description={description}
          key={description._id}
          sessionFromServer={sessionFromServer}
          tagList={tagList}
        />
      </div>
    </div>
  );
}
