"use client";

import React, { useState } from "react";

import GeneralOpenCloseButton from "@components/ReusableSmallComponents/buttons/generalOpenCloseButton";

import WideCenteredHeader from "@components/ReusableSmallComponents/TitlesOrHeadings/WideCenteredHeading";

import PointSystemList from "@components/Ranking/PointSystemList";
import DashboardChartForFavDescriptions from "@components/ShowingListOfContent/DashboardChartForFavDescriptions";
import NameListingAsSections from "@components/ShowingListOfContent/NameListingAsSections";

import ProfileImage from "@components/ReusableSmallComponents/ProfileImage";
import LinkButton from "@components/ReusableSmallComponents/buttons/LinkButton";

import { useSession } from "next-auth/react";

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
            className="block rounded-lg shadow-lg px-6 py-12 md:py-16 md:px-12"
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
                <section className="flex items-center border-b-2 border-subtleWhite pb-10">
                  <div className="flex-1">
                    <h3 className="text-subtleWhite  font-bold mb-2 mx-auto font-semibold text-4xl mb-4">
                      {`Welcome Back ${userName}!`}
                    </h3>

                    <div className="bg-secondary rounded-2xl flex flex-col py-2 max-w-96 mx-auto">
                      <h4 className="pt-4"> Edit Contributions or Profile:</h4>
                      <LinkButton
                        href={`${
                          process.env.NEXT_PUBLIC_BASE_FETCH_URL
                        }profile/${session.user.profilename.toLowerCase()}`}
                        text="edit"
                        className="w-48 mx-auto "
                        subtle
                      />
                    </div>
                  </div>

                  <ProfileImage
                    divStyling="w-44"
                    profileImage={profileImage}
                    layout="responsive"
                    className="ml-3  h-32 rounded-full inline  shadow-xl"
                    width={200}
                    height={200}
                  />
                </section>

                <PointSystemList
                  namesLikes={likedNames.length}
                  namesAdds={namesCreated.length}
                  descriptionsLikes={likedDescriptions.length}
                  descriptionsAdds={createdDescriptions.length}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ############# FAVORITE LISTS SECTION ############ */}

      <section className=" px-4 pt-4   mx-auto  text-center">
        <WideCenteredHeader heading="Your Favorites" />

        <div
          className="favoriteSubsections mt-5 text-subtleWhite  font-bold mb-2 text-lg 
       pb-2
       border-b-2
      border-subtleWhite w-full"
        >
          {/* ############# FAVORITE NAMES LIST ############ */}

          <section className="favoriteNames">
            <div className="">
              <GeneralOpenCloseButton
                text="Names"
                setStatus={setFavoritesListOpen}
                className="mb-2 w-48"
                status={favoritesListOpen}
              />
            </div>

            {favoritesListOpen == true && (
              <div>
                {likedNames.map((name) => {
                  return (
                    <NameListingAsSections
                      name={name}
                      key={name._id}
                      dataType="names"
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* ############# FAVORITE DESCRIPTIONS LIST ############ */}

          <section className="favoriteDescriptions">
            <GeneralOpenCloseButton
              text="Descriptions"
              setStatus={setFavDescriptionsOpen}
              className="mb-2 w-48"
              status={favDescriptionsOpen}
            />

            {favDescriptionsOpen && (
              <DashboardChartForFavDescriptions
                likedDescriptions={likedDescriptions}
                className="text-base text-violet-100"
              />
            )}
          </section>
        </div>
      </section>
    </section>
  );
}
