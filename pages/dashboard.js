import React, { useContext, createContext, useState, useEffect } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import Link from "next/link";
import GeneralOpenCloseButton from "../components/ReusableSmallComponents/buttons/generalOpenCloseButton";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import { useRouter } from "next/router";
import Image from "next/image";

import WideCenteredHeader from "../components/ReusableSmallComponents/TitlesOrHeadings/WideCenteredHeading";
import SingleComment from "../components/ShowingListOfContent/SingleComment";
import BatsignalPost from "../components/ShowingListOfContent/batsignalPost";
import PointSystemList from "../components/ShowingListOfContent/PointSystemList";
import DashboardChartForFavDescriptions from "../components/ShowingListOfContent/DashboardChartForFavDescriptions";
import NameListingAsSections from "../components/ShowingListOfContent/NameListingAsSections";
import HeadersForNames from "../components/ShowingListOfContent/HeadersForNames";

import dbConnect from "../utils/db";
import Names from "../models/Names";
import IndividualPosts from "../models/Post";
import BatSignalComments from "../models/BatSignalComment";
import Descriptions from "../models/description";
import DescriptionTag from "../models/descriptiontag";
import NameTag from "../models/NameTag";
import ProfileImage from "../components/ReusableSmallComponents/ProfileImage";

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
    const UserId = await session.user._id;

    //namelist not used so nameData not needed?
    // let nameResponse = await fetch(
    //   `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/names`
    // );
    // let nameData = await nameResponse.json();

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

    //POSTS ADDED BY USER

    const postData = await IndividualPosts.find({
      createdby: UserId,
    }).populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    });

    //POSTS LIKED BY USER

    const postsLiked = await IndividualPosts.find({
      likedby: UserId,
    }).populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    });

    //COMMENTS ADDED BY USER

    const UsersCommentData = await BatSignalComments.find({
      createdby: UserId,
    }).populate({
      path: "createdby",
      select: ["name", "profilename", "profileimage"],
    });

    //COMMENTS LIKED BY USER

    const likedComments = await BatSignalComments.find({
      likedby: UserId,
    }).populate({
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

        postsCreated: JSON.parse(JSON.stringify(postData)),

        postsLiked: JSON.parse(JSON.stringify(postsLiked)),

        commentsCreated: JSON.parse(JSON.stringify(UsersCommentData)),

        likedComments: JSON.parse(JSON.stringify(likedComments)),

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
  postsCreated,
  postsLiked,
  likedComments,
  commentsCreated,
  likedDescriptions,
  createdDescriptions,
  descriptionTagListProp,
  NameTagListProp,
}) {
  const [favoritesListOpen, setFavoritesListOpen] = useState(false);

  const [favCommentsOpen, setFavCommentsOpen] = useState(false);

  const [favPostsOpen, setFavPostsOpen] = useState(false);

  const [favDescriptionsOpen, setFavDescriptionsOpen] = useState(false);

  //for Nav menu profile name and image
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu

  const category = [
    {
      name: "BatSignal!",
      _id: "1",
      tags: [
        "name suggestions",
        "description suggestions",
        "fundraising ideas",
        "social media ideas",
        "photography ideas",
        "other ideas",
      ],
    },
    {
      name: "PlayYard & Community",
      _id: "2",
      tags: ["General ChitChat", "showoff your pets!"],
    },
    { name: "Bugs & Feedback", _id: "3", tags: ["bugs", "feedback"] },
  ];

  let tagListProp = category
    .map((category) => category.tags)
    .reduce((sum, value) => sum.concat(value), []);

  return (
    <div className="bg-violet-900 h-fit">
      <Layout
        profileImage={profileImage}
        userName={userName}
        sessionFromServer={sessionFromServer}
      />

      <section>
        <div
          className="relative overflow-hidden bg-no-repeat bg-cover"
          style={{
            backgroundPosition: "80%",
            backgroundImage: `url("/dogheaderfreewebheaders.jpg")`,
            height: "200px",
          }}
        ></div>

        <div className="container mx-auto px-4 md:px-12 xl:px-32">
          <div className="text-center text-white">
            <div
              className="block rounded-lg shadow-lg px-6 py-12 md:py-16 md:px-12"
              style={{
                marginTop: "-70px",
                background: "hsla(273, 98%, 60%, 0.4)",
                backdropFilter: "blur(20px)",
              }}
            >
              {!sessionFromServer ? (
                "Loading"
              ) : (
                <div>
                  <section className="Welcome-username-and-profile-image flex items-center border-b-2 border-yellow-300 pb-4">
                    <div className="flex-1">
                      <h3 className="text-yellow-400  font-bold mb-2 mx-auto font-semibold text-4xl mb-4">
                        {`Welcome Back ${userName}!`}
                      </h3>

                      <button className="bg-darkPurple py-2 px-4 rounded-xl text-white border-2 border-yellow-300 shadow-xl">
                        <Link
                          href={`${
                            process.env.NEXT_PUBLIC_BASE_FETCH_URL
                          }profile/${sessionFromServer.user.profilename.toLowerCase()}`}
                        >
                          profile link/ edit contributions
                        </Link>
                      </button>
                    </div>

                    <ProfileImage
                      divStyling="w-44"
                      profileImage={profileImage}
                      layout="responsive"
                      className="ml-3  h-32 rounded-full inline border-2 border-yellow-300 shadow-xl"
                      width={200}
                      height={200}
                    />
                  </section>

                  <PointSystemList
                    favNames={favNames}
                    namesCreated={namesCreated}
                    postsCreated={postsCreated}
                    postsLiked={postsLiked}
                    commentsCreated={commentsCreated}
                    likedComments={likedComments}
                    createdDescriptions={createdDescriptions}
                    likedDescriptions={likedDescriptions}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ############# FAVORITE LISTS SECTION ############ */}

      <section className="favoritesSection px-4 pt-4 text-center">
        <WideCenteredHeader heading="Your Favorites" />

        <div
          className="favoriteSubsections mt-5 text-yellow-400  font-bold mb-2 text-lg 
       pb-2
       border-b-2
       border-yellow-300"
        >
          {/* ############# FAVORITE NAMES LIST ############ */}

          <section className="favoriteNames">
            <div className="">
              <GeneralOpenCloseButton
                text="Favorites Names"
                setStatus={setFavoritesListOpen}
                styling="mb-2 w-96"
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
                      signedInUsersId={sessionFromServer.user._id}
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
              text="Favorites Descriptions"
              setStatus={setFavDescriptionsOpen}
              styling="mb-2 w-96"
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

          {/* ############# FAVORITE COMMENTS LIST ############ */}

          <section>
            <GeneralOpenCloseButton
              text="Favorite Post Comments"
              setStatus={setFavCommentsOpen}
              styling="mb-2 w-96"
              status={favCommentsOpen}
            />

            {favCommentsOpen &&
              likedComments.map((comment) => {
                return (
                  <SingleComment
                    key={comment._id}
                    rootComment={comment}
                    sessionFromServer={sessionFromServer}
                    typeOfContentReplyingTo="post"
                    apilink="/api/individualbatsignalcomments"
                    apilinklikes="/api/individualbatsignalcomments/updatecommentlikes"
                  />
                );
              })}
          </section>

          <section>
            <GeneralOpenCloseButton
              text="Favorite Posts"
              setStatus={setFavPostsOpen}
              styling="mb-2 w-96"
              status={favPostsOpen}
            />

            {favPostsOpen &&
              postsLiked.map((post) => {
                return (
                  <BatsignalPost
                    post={post}
                    key={post._id}
                    className="mx-auto"
                    signedInUsersId={sessionFromServer.user._id}
                    sessionFromServer={sessionFromServer}
                    tagListProp={tagListProp}
                  />
                );
              })}
          </section>
        </div>
      </section>

      {/* <p>{userId}</p> */}
    </div>
  );
}
