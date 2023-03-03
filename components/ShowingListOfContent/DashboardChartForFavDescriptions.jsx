import React from "react";
import DescriptionListingAsSections from "./DescriptionListingAsSections";
import HeadersForCategories from "./HeadersForDescriptions";

export default function DashboardChartForFavDescriptions({
  likedDescriptions,
  sessionFromServer,
  tagList,
}) {
  return (
    <div>
      <HeadersForCategories />

      {likedDescriptions.map((description) => {
        return (
          <DescriptionListingAsSections
            description={description}
            key={description._id}
            sessionFromServer={sessionFromServer}
            tagList={tagList}
          ></DescriptionListingAsSections>
        );
      })}
    </div>
  );
}
