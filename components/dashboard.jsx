"use client";

import React, { useState } from "react";

import GeneralOpenCloseButton from "@components/ReusableSmallComponents/buttons/generalOpenCloseButton";

import WideCenteredHeader from "@components/ReusableSmallComponents/TitlesOrHeadings/WideCenteredHeading";

import PointSystemList from "@components/Ranking/PointSystemList";
import DashboardChartForFavDescriptions from "@components/ShowingListOfContent/DashboardChartForFavDescriptions";
import ContentListing from "@/components/ShowingListOfContent/ContentListing";

import ProfileImage from "@components/ReusableSmallComponents/ProfileImage";
import LinkButton from "@components/ReusableSmallComponents/buttons/LinkButton";

import { useSession } from "next-auth/react";
import CoreListingPageLogic from "./CoreListingPagesLogic";

export default function Dashboard({
  likedNames,
  namesCreated,
  createdDescriptions,
  likedDescriptions,
}) {
  //       descriptionTagListProp,
  //   NameTagListProp,

  const { data: session } = useSession();
  const [favoritesListOpen, setFavoritesListOpen] = useState(false);

  const [favDescriptionsOpen, setFavDescriptionsOpen] = useState(false);

  const userName = session?.user?.name || "Guest";
  const swrForThisUserID = session?.user?.id || "";
  const profileImage = session?.user?.profileimage || "/default-profile.png";

  return (
    <section>
      <div
        className="relative overflow-hidden bg-no-repeat bg-cover mx-auto"
        style={{
          backgroundPosition: "80%",
          backgroundImage: `url("/dogheaderfreewebheaders.jpg")`,
          height: "200px",
        }}
      ></div>

      <div className="container mx-auto px-4 md:px-12 xl:px-32 ">
        <div className="text-center text-subtleWhite bg-primary">
          <div
            className="block rounded-2xl shadow-lg px-6 py-2 md:py-4 md:px-12"
            style={{
              marginTop: "-70px",
              background: "hsla(273, 98%, 35%, 0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            {!session ? (
              "Loading"
            ) : (
              <div>
                <section className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-subtleWhite mx-auto font-semibold text-3xl mb-2">
                      {`Welcome Back ${userName}!`}
                    </h3>

                    <PointSystemList
                      namesLikes={likedNames.length}
                      namesAdds={namesCreated.length}
                      descriptionsLikes={likedDescriptions.length}
                      descriptionsAdds={createdDescriptions.length}
                    />
                  </div>
                  {/* 
                  <ProfileImage
                    divStyling="w-28"
                    profileImage={profileImage}
                    layout="responsive"
                    className="ml-3  h-32 rounded-full inline  shadow-xl"
                    width={100}
                    height={100}
                  /> */}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ############# FAVORITE LISTS SECTION ############ */}

      <section className=" px-4 pt-4   mx-auto  text-center">
        <div
          className="favoriteSubsections mt-5 text-subtleWhite  font-bold mb-2 text-lg 
       pb-2
       w-full"
        >
          {/* ############# FAVORITE NAMES LIST ############ */}

          <section className="flex border-b border-subtleWhite items-center justify-center">
            <GeneralOpenCloseButton
              text="Fav Names"
              setStatus={setFavoritesListOpen}
              className="mb-2"
              status={favoritesListOpen}
            />

            <GeneralOpenCloseButton
              text="Fav Descriptions"
              setStatus={setFavDescriptionsOpen}
              className="mb-2"
              status={favDescriptionsOpen}
            />

            <GeneralOpenCloseButton
              text="Added Names"
              setStatus={setFavDescriptionsOpen}
              className="mb-2"
              status={favDescriptionsOpen}
            />

            <GeneralOpenCloseButton
              text="Added Descriptions"
              setStatus={setFavDescriptionsOpen}
              className="mb-2"
              status={favDescriptionsOpen}
            />
          </section>

          {favoritesListOpen == true && (
            <div>
              <CoreListingPageLogic
                dataType="names"
                swrForThisUserID={swrForThisUserID}
                showHeader={false}
              />
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
