import React from "react";

import "@fortawesome/fontawesome-svg-core/styles.css";

import DescriptionListingAsSections from "@components/ShowingListOfContent/DescriptionListingAsSections";
import dbConnect from "@utils/db";
import Descriptions from "@/models/Description";

import { notFound } from "next/navigation";

const ObjectId = require("mongodb").ObjectId;
import { leanWithStrings } from "@/utils/mongoDataCleanup";
import NameListingAsSections from "@/components/ShowingListOfContent/NameListingAsSections";

export default async function Postid({ params }) {
  const { id } = params;

  await dbConnect.connect();
  const descriptionId = ObjectId(id);

  let description = await leanWithStrings(
    Descriptions.findById(descriptionId)
      .populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      })
      .populate({ path: "tags", select: ["tag"] }),
  );

  console.log(description, "description");
  if (!description) {
    notFound();
  }

  return (
    <div className="mx-2">
      <span> it works!</span>
      <NameListingAsSections
        dataType={dataType}
        singleContent={singleContent}
        key={singleContent._id}
        signedInUsersId={signedInUsersId}
        mutate={mutate}
      />
    </div>
  );
}
