import React from "react";
import DescriptionListingAsSections from "./DescriptionListingAsSections";

export default function DashboardChartForFavDescriptions({
  likedDescriptions,
  sessionFromServer,
  tagList,
  className,
}) {
  return (
    <div className="bg-darkPurple">
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
