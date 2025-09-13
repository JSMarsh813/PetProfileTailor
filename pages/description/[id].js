import React from "react";
import NameListingAsSections from "@components/ShowingListOfContent/NameListingAsSections";
import "@fortawesome/fontawesome-svg-core/styles.css";

import NavLayoutwithSettingsMenu from "@components/NavBar/NavLayoutwithSettingsMenu";
import DescriptionListingAsSections from "@components/ShowingListOfContent/DescriptionListingAsSections";
import dbConnect from "@utils/db";
import Descriptions from "@/models/Description";
import DescriptionTag from "@/models/DescriptionTag";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

const ObjectId = require("mongodb").ObjectId;

export const getServerSideProps = async (context) => {
  //allows us to grab the dynamic value from the url
  const id = context.params.id;

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  // let descriptionResponse = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/description/getASpecificDescriptionById/` +
  //     id
  // );
  // let descriptionData = await descriptionResponse.json();

  await dbConnect.connect();
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
        sessionFromServer={sessionFromServer}
      />

      <div className="mx-2">
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
