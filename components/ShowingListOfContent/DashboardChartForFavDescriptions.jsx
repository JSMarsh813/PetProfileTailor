import React from "react";
// import DescriptionListingAsSections from "./DescriptionListingAsSections";
import { useCategoriesForDataType } from "@/hooks/useCategoriesForDataType";
import { useSession } from "next-auth/react";

export default function DashboardChartForFavDescriptions({
  likedDescriptions,
  className,
}) {
  const { categoriesWithTags, tagList } =
    useCategoriesForDataType("descriptions");
  const { data: session } = useSession();

  return (
    <div className="bg-secondary">
      {/* {likedDescriptions.map((description) => {
        return (
          <DescriptionListingAsSections
            description={description}
            key={description._id}
            sessionFromServer={session}
            tagList={tagList}
            className={className}
          ></DescriptionListingAsSections>
        );
      })} */}
    </div>
  );
}
