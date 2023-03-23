import React from "react";
import DescriptionListingAsSections from "./DescriptionListingAsSections";
import HeadersForCategories from "./HeadersForDescriptions";

export default function DashboardChartForFavDescriptions({
  likedDescriptions,
  sessionFromServer,
  tagList,
  className,
}) {
  return (
    <div className="bg-darkPurple">
      <HeadersForCategories />

      {likedDescriptions.map((description) => {
        return (
          <DescriptionListingAsSections
            description={description}
            key={description._id}
            sessionFromServer={sessionFromServer}
            tagList={tagList}
            className={className}
          ></DescriptionListingAsSections>
        );
      })}
    </div>
  );
}
