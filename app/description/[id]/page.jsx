import React from "react";

import "@fortawesome/fontawesome-svg-core/styles.css";

import ContentListing from "@/components/ShowingListOfContent/ContentListing";
import dbConnect from "@utils/db";
import Descriptions from "@/models/Description";

import { notFound } from "next/navigation";

const ObjectId = require("mongodb").ObjectId;
import { leanWithStrings } from "@/utils/mongoDataCleanup";

export default async function Postid({ params }) {
  const { id } = params;

  await dbConnect.connect();
  const descriptionId = ObjectId(id);

  let description = await leanWithStrings(
    Descriptions.findById(descriptionId)
      .populate({
        path: "createdBy",
        select: ["name", "profileName", "profileImage"],
      })
      .populate({ path: "tags", select: ["tag"] }),
  );

  console.log(description, "description");
  if (!description) {
    notFound();
  }

  return (
    <div className="mx-2">
      <ContentListing
        dataType="descriptions"
        singleContent={description}
        mode="local"
      />
    </div>
  );
}
