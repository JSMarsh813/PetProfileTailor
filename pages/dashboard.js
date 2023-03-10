import React, { useContext, createContext, useState, useEffect } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import Link from "next/link";

import UserSessionContext from "../src/context/UserSessionContext";

import GeneralOpenCloseButton from "../components/ReusableSmallComponents/buttons/generalOpenCloseButton";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import Names from "../models/Names";
// //wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work
import { useRouter } from "next/router";

import WideCenteredHeader from "../components/ReusableSmallComponents/TitlesOrHeadings/WideCenteredHeading";
import SingleComment from "../components/ShowingListOfContent/SingleComment";
import BatsignalPost from "../components/ShowingListOfContent/BatSignalPost";
import PointSystemList from "../components/ShowingListOfContent/PointSystemList";
import DashboardChartForFavDescriptions from "../components/ShowingListOfContent/DashboardChartForFavDescriptions";
import NameListingAsSections from "../components/ShowingListOfContent/NameListingAsSections";
import HeadersForNames from "../components/ShowingListOfContent/HeadersForNames";

export const getServerSideProps = async (context) => {
  let nameResponse = await fetch(`${process.env.BASE_FETCH_URL}/api/names`);
  let nameData = await nameResponse.json();

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const UserId = await session.user._id;

  //USERS FAVED NAMES //
  //forces it to wait for session before looking up data

  let findLikedNames = await fetch(
    `${process.env.BASE_FETCH_URL}/api/names/findNamesLikedByUser/${UserId}`
  );

  let likedNames = await findLikedNames.json();

  //NAMES ADDED BY USER //

  let namesCreatedData = await fetch(
    `${process.env.BASE_FETCH_URL}/api/names/namesContainingUserId/${UserId}`
  );

  let namesCreated = await namesCreatedData.json();

  //POSTS ADDED BY USER

  let postResponse = await fetch(
    `${process.env.BASE_FETCH_URL}/api/individualposts/postscontaininguserid/` +
      UserId
  );
  let postData = await postResponse.json();

  //POSTS LIKED BY USER

  let findPostsLiked = await fetch(
    `${process.env.BASE_FETCH_URL}/api/individualposts/findLikedPosts/` + UserId
  );
  let postsLiked = await findPostsLiked.json();

  //COMMENTS ADDED BY USER

  let UsersCommentResponse = await fetch(
    `${process.env.BASE_FETCH_URL}/api/individualbatsignalcomments/commentscontaininguserid/` +
      UserId
  );
  let UsersCommentData = await UsersCommentResponse.json();

  //COMMENTS LIKED BY USER

  let findLikedComments = await fetch(
    `${process.env.BASE_FETCH_URL}/api/individualbatsignalcomments/findLikedBatsignalComments/` +
      UserId
  );
  let likedComments = await findLikedComments.json();

  //grabbing all comments for posts

  let allCommentsResponse = await fetch(
    `${process.env.BASE_FETCH_URL}/api/individualbatsignalcomments`
  );
  let allComments = await allCommentsResponse.json();

  //grabbing DESCRIPTIONS added by user

  let findCreatedDescriptions = await fetch(
    `${process.env.BASE_FETCH_URL}/api/description/descriptionsCreatedByLoggedInUser/${UserId}`
  );

  let createdDescriptions = await findCreatedDescriptions.json();

  //grabbing DESCRIPTIONS liked by user

  let findLikedDescriptions = await fetch(
    `${process.env.BASE_FETCH_URL}/api/description/findDescriptionsLIkedByUserId/` +
      UserId
  );
  let likedDescriptions = await findLikedDescriptions.json();
  //  console.log(`this is likedDescriptions ${JSON.stringify(likedDescriptions)}`)

  //grabbing Tags for description edit function

  let descriptionTagList = await fetch(
    `${process.env.BASE_FETCH_URL}/api/descriptiontag`
  );
  let descriptionTagData = await descriptionTagList.json();

  let descriptionTagListProp = descriptionTagData
    .map((tag) => tag.tag)
    .reduce((sum, value) => sum.concat(value), []);
  return {
    props: {
      sessionFromServer: session,

      nameList: nameData,
      namesCreated: namesCreated,
      favNames: likedNames,

      postsCreated: postData,
      postsLiked: postsLiked,

      commentsCreated: UsersCommentData,
      likedComments: likedComments,
      allComments: allComments,

      likedDescriptions: likedDescriptions,
      createdDescriptions: createdDescriptions,
      descriptionTagListProp: descriptionTagListProp,
    },
  };
  //kept getting an error that it couldn't parse due to Error serializing `.userIdFromServer.user.image` but there was no image property....adding an image property and making it null also didn't work. JSON.parse(JSON.stringify((session)) used as a workaround)

  //and provide the data as props to the page by returning an object from the function
};

export default function Dashboard({
  nameList,
  sessionFromServer,
  user,
  allComments,

  namesCreated,
  favNames,
  postsCreated,
  postsLiked,
  likedComments,
  commentsCreated,
  likedDescriptions,
  createdDescriptions,
  descriptionTagListProp,
}) {
  const [favoritesListOpen, setFavoritesListOpen] = useState(false);

  const valuetest = useContext(UserSessionContext);

  const router = useRouter();

  useEffect(() => {
    if (!sessionFromServer) {
      router.push("/login");
    }
  }, [router, sessionFromServer]);

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
      />

      <section>
        <div
          className="relative overflow-hidden bg-no-repeat bg-cover"
          style={{
            backgroundPosition: "80%",
            backgroundImage: `url("https://www.freewebheaders.com/wp-content/gallery/dogs/dogs-header-2121-800x200.jpg")`,
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
                          href={`http://localhost:3000/profile/${sessionFromServer.user.name.toLowerCase()}`}
                        >
                          profile link/ edit contributions
                        </Link>
                      </button>
                    </div>
                    <img
                      className="ml-3  h-32 rounded-full inline border-2 border-yellow-300 shadow-xl"
                      src={profileImage}
                    />

                    {/* for large screens: -mt-11 */}
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
          className="favoriteSubsections mt-5 text-yellow-400  font-bold mb-2 text-2xl 
       pb-2
       border-b-2
       border-yellow-300"
        >
          {/* ############# FAVORITE NAMES LIST ############ */}

          <section className="favoriteNames">
            <div className="flow-root w-screen">
              <GeneralOpenCloseButton
                text="Open Your Favorites Names List"
                setStatus={setFavoritesListOpen}
                styling="mb-2"
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
                      sessionFromServer={sessionFromServer}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* ############# FAVORITE DESCRIPTIONS LIST ############ */}

          <section className="favoriteDescriptions">
            <GeneralOpenCloseButton
              text="Open Your Favorites Descriptions List"
              setStatus={setFavDescriptionsOpen}
              styling="mb-2"
              status={favDescriptionsOpen}
            />

            {favDescriptionsOpen && (
              <DashboardChartForFavDescriptions
                likedDescriptions={likedDescriptions}
                sessionFromServer={sessionFromServer}
                tagList={descriptionTagListProp}
              />
            )}
          </section>
          {/* ############# FAVORITE COMMENTS LIST ############ */}

          <section>
            <GeneralOpenCloseButton
              text="View Your Favorite Comments"
              setStatus={setFavCommentsOpen}
              styling="mb-2"
              status={favCommentsOpen}
            />

            {favCommentsOpen &&
              likedComments.map((comment) => {
                console.log(comment);
                return (
                  <SingleComment
                    key={comment._id}
                    rootComment={comment}
                    sessionFromServer={sessionFromServer}
                  />
                );
              })}
          </section>

          <section>
            <GeneralOpenCloseButton
              text="View Your Favorite Posts"
              setStatus={setFavPostsOpen}
              styling="mb-2"
              status={favPostsOpen}
            />

            {favPostsOpen &&
              postsLiked.map((post) => {
                return (
                  <BatsignalPost
                    post={post}
                    key={post._id}
                    className="mx-auto"
                    sessionFromServer={sessionFromServer}
                    commentList={allComments}
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
