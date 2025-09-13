import React, { useContext, createContext, useState, useEffect } from "react";
import Layout from "@components/NavBar/NavLayoutwithSettingsMenu";

import GeneralOpenCloseButton from "@components/ReusableSmallComponents/buttons/generalOpenCloseButton";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import WideCenteredHeader from "@components/ReusableSmallComponents/TitlesOrHeadings/WideCenteredHeading";

import PointSystemList from "@components/Ranking/PointSystemList";
import DashboardChartForFavDescriptions from "@components/ShowingListOfContent/DashboardChartForFavDescriptions";
import NameListingAsSections from "@components/ShowingListOfContent/NameListingAsSections";
import HeadersForNames from "@components/ShowingListOfContent/HeadersForNames";

import dbConnect from "@utils/db";
import Names from "@models/Names";

import Descriptions from "@/models/Description";
import DescriptionTag from "@/models/DescriptionTag";
import NameTag from "@models/NameTag";
import ProfileImage from "@components/ReusableSmallComponents/ProfileImage";
import LinkButton from "@components/ReusableSmallComponents/buttons/LinkButton";

// const ObjectId = require("mongodb").ObjectId;

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  } else {
    const UserId = await session.user.id;

    await dbConnect.connect();

    //USERS FAVED NAMES //

    const likedNames = await Names.find({ likedby: UserId })
      .populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      })
      .populate({ path: "tags" });

    console.log(likedNames);
    //NAMES ADDED BY USER //

    const namesCreated = await Names.find({ createdby: UserId }).populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    });

    //grabbing DESCRIPTIONS added by user

    const createdDescriptions = await Descriptions.find({
      createdby: UserId,
    }).populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    });

    //grabbing DESCRIPTIONS liked by user
    const likedDescriptions = await Descriptions.find({
      likedby: UserId,
    })
      .populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      })
      .populate({
        path: "tags",
      });

    //grabbing Tags for description edit function

    const descriptionTagData = await DescriptionTag.find();

    let descriptionTagListProp = descriptionTagData
      .map((tag) => tag)
      .reduce((sum, value) => sum.concat(value), []);

    const NameTagListProp = await NameTag.find();

    return {
      props: {
        sessionFromServer: session,
        namesCreated: JSON.parse(JSON.stringify(namesCreated)),

        favNames: JSON.parse(JSON.stringify(likedNames)),

        likedDescriptions: JSON.parse(JSON.stringify(likedDescriptions)),

        createdDescriptions: JSON.parse(JSON.stringify(createdDescriptions)),

        descriptionTagListProp: JSON.parse(
          JSON.stringify(descriptionTagListProp),
        ),

        NameTagListProp: JSON.parse(JSON.stringify(NameTagListProp)),
      },
    };
  }
};

export default function Dashboard({
  sessionFromServer,
  namesCreated,
  favNames,

  likedDescriptions,
  createdDescriptions,
  descriptionTagListProp,
  NameTagListProp,
}) {
  const [favoritesListOpen, setFavoritesListOpen] = useState(false);

  const [favDescriptionsOpen, setFavDescriptionsOpen] = useState(false);

  //for Nav menu profile name and image
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  // let tagListProp = category
  //   .map((category) => category.tags)
  //   .reduce((sum, value) => sum.concat(value), []);

  return (
    <div className=" h-fit">
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <section>
        <div
          className="relative overflow-hidden bg-no-repeat bg-cover max-w-7xl mx-auto"
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
              {!sessionFromServer ? (
                "Loading"
              ) : (
                <div>
                  <section className="flex items-center border-b-2 border-subtleWhite pb-10">
                    <div className="flex-1">
                      <h3 className="text-subtleWhite  font-bold mb-2 mx-auto font-semibold text-4xl mb-4">
                        {`Welcome Back ${userName}!`}
                      </h3>

                      <div className="bg-secondary rounded-2xl flex flex-col py-2 max-w-96 mx-auto">
                        <h4 className="pt-4">
                          {" "}
                          Edit Contributions or Profile:
                        </h4>
                        <LinkButton
                          href={`${
                            process.env.NEXT_PUBLIC_BASE_FETCH_URL
                          }profile/${sessionFromServer.user.profilename.toLowerCase()}`}
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
                    namesLikes={favNames.length}
                    namesAdds={namesCreated.length}
                    descriptionsLikes={likedDescriptions.length}
                    descriptionsAdds={createdDescriptions.length}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ############# FAVORITE LISTS SECTION ############ */}

      <section className=" px-4 pt-4  max-w-7xl mx-auto  text-center">
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
                <HeadersForNames />
                {favNames.map((name) => {
                  return (
                    <NameListingAsSections
                      name={name}
                      key={name._id}
                      signedInUsersId={sessionFromServer.user.id}
                      tagList={NameTagListProp}
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
                sessionFromServer={sessionFromServer}
                tagList={descriptionTagListProp}
                className="text-base text-violet-100"
              />
            )}
          </section>
        </div>
      </section>

      {/* <p>{userId}</p> */}
    </div>
  );
}
