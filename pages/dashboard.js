import React, { useContext, createContext, useState, useEffect } from "react";
import Layout from "../components/NavBar/NavLayoutwithSettingsMenu";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faCookieBite,
  faRankingStar,
  faTags,
  faIgloo,
  faLightbulb,
  faIdCard,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import Link from "next/Link";

import axios from "axios";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import UserSessionContext from "../src/context/UserSessionContext";

import GeneralButton from "../components/ReusableSmallComponents/buttons/GeneralButton";
import GeneralOpenCloseButton from "../components/ReusableSmallComponents/buttons/generalOpenCloseButton";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

// import PostCategoryData from "../pages/api/BatSignalPostCategoryData/PostCategoryData"
import db from "../utils/db";
// import { connectToDatabase } from '../pages/api/auth/lib/db'

import Names from "../models/Names";
// import User from "../models/User"
// //wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work
import { useRouter } from "next/router";

import RankNames from "../components/RankNames";
import WideCenteredHeader from "../components/ReusableSmallComponents/TitlesOrHeadings/WideCenteredHeading";
import SingleComment from "../components/ShowingListOfContent/SingleComment";
import BatsignalPost from "../components/ShowingListOfContent/BatSignalPost";
import PointSystemList from "../components/ShowingListOfContent/PointSystemList";
import DashboardChartForFavDescriptions from "../components/ShowingListOfContent/DashboardChartForFavDescriptions";
import NameListingAsSections from "../components/ShowingListOfContent/NameListingAsSections";
import HeadersForNames from "../components/ShowingListOfContent/HeadersForNames";

export const getServerSideProps = async (context) => {
  // let response = await fetch('http://localhost:3000/api/name-categories');
  // let data = await response.json()

  //all names?
  let nameResponse = await fetch("http://localhost:3000/api/names");
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
    `http://localhost:3000/api/names/findNamesLikedByUser/${UserId}`
  );

  let likedNames = await findLikedNames.json();

  //NAMES ADDED BY USER //

  let namesCreatedData = await fetch(
    `http://localhost:3000/api/names/namesContainingUserId/${UserId}`
  );

  let namesCreated = await namesCreatedData.json();

  //POSTS ADDED BY USER

  let postResponse = await fetch(
    "http://localhost:3000/api/individualposts/postscontaininguserid/" + UserId
  );
  let postData = await postResponse.json();

  //POSTS LIKED BY USER

  let findPostsLiked = await fetch(
    "http://localhost:3000/api/individualposts/findLikedPosts/" + UserId
  );
  let postsLiked = await findPostsLiked.json();

  //COMMENTS ADDED BY USER

  let UsersCommentResponse = await fetch(
    "http://localhost:3000/api/individualbatsignalcomments/commentscontaininguserid/" +
      UserId
  );
  let UsersCommentData = await UsersCommentResponse.json();

  //COMMENTS LIKED BY USER

  let findLikedComments = await fetch(
    "http://localhost:3000/api/individualbatsignalcomments/findLikedBatsignalComments/" +
      UserId
  );
  let likedComments = await findLikedComments.json();

  //grabbing all comments for posts

  let allCommentsResponse = await fetch(
    "http://localhost:3000/api/individualbatsignalcomments"
  );
  let allComments = await allCommentsResponse.json();

  //grabbing DESCRIPTIONS added by user

  let findCreatedDescriptions = await fetch(
    `http://localhost:3000/api/description/descriptionsCreatedByLoggedInUser//${UserId}`
  );

  let createdDescriptions = await findCreatedDescriptions.json();

  //grabbing DESCRIPTIONS liked by user

  let findLikedDescriptions = await fetch(
    "http://localhost:3000/api/description/findDescriptionsLIkedByUserId/" +
      UserId
  );
  let likedDescriptions = await findLikedDescriptions.json();
  //  console.log(`this is likedDescriptions ${JSON.stringify(likedDescriptions)}`)

  //grabbing Tags for description edit function

  let descriptionTagList = await fetch(
    "http://localhost:3000/api/descriptiontag"
  );
  let descriptionTagData = await descriptionTagList.json();

  let descriptionTagListProp = descriptionTagData
    .map((tag) => tag.tag)
    .reduce((sum, value) => sum.concat(value), []);
  // try {
  //   await dbConnect() //from config/mongo.js

  //     const individualNames = await IndividualNames.find();
  //     filteredNames = individualNames.filter(name=>name.likedby.includes("63a90c2e83e6366b179ffc40"))
  //     return filteredNames

  //   } catch (err) {
  //     JSON.stringify(err);
  //   }

  // console.log(data);
  //getServerSideProps allows us to fetch data from an api
  //runs only on server side, will never run clicent side
  //can run server-side code directly in getStaticProps
  return {
    props: {
      // category: data,
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

  // setTotalPoints(treatPoints)

  //  console.log(sessionFromServer)

  const [favCommentsOpen, setFavCommentsOpen] = useState(false);

  const [favPostsOpen, setFavPostsOpen] = useState(false);

  const [favDescriptionsOpen, setFavDescriptionsOpen] = useState(false);

  //for Nav menu profile name and image
  //let section exists in case the user is not signed in
  let userName = "";
  let profileImage = "";

  if (sessionFromServer) {
    userName = sessionFromServer.user.name;
    profileImage = sessionFromServer.user.profileimage;
  }
  //end of section for nav menu
  //   let [userId,setUserId]=useState(userIdFromServer._id)

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

  // console.log(category)
  // let categorytest=Object.values(PostCategoryData)
  //  console.log(`this is categorytest ${JSON.stringify(categorytest)}`)

  // {console.log(`from server ${(userId)}`)}

  // const currentUserInfo = async ({ name, email, password }) => {
  //   try {
  //     await axios.post('/api/auth/signup', {
  //       name,
  //       email,
  //       password,
  //     });

  //     const result = await signIn('credentials', {
  //       redirect: false,
  //       email,
  //       password,
  //     });
  //     if (result.error) {
  //       toast.error(result.error);
  //     }
  //     else {

  //       toast.success("Successfully signed up! Sending to profile page")
  //       console.log(result)
  //       // Object { error: null, status: 200, ok: true, url: "http://localhost:3000/api/auth/signin?csrf=true" }
  //       console.log(`email: ${email} pass:${password}`)
  //       //email: kyunyu@gmail.com pass:testtest
  //       //and appears in mongodb users collection
  //       router.push("/")
  //     }
  //   } catch (err) {
  //     toast.error(getError(err));
  //   }
  // };

  //grab userID from localStorage

  // useEffect(() => {
  //   let data= (!localStorage.getItem("session"))?
  //       data="0":
  //       data=JSON.parse(localStorage.getItem("session")).toString()

  //we had to convert mongo's object ID to a JSON object, JSON.stringify to store in local storage when we logged in at login.js
  //however JSON's objects are stored with two "", so it stored as ""145555ect""
  // so data=="145555ect" would always be false since ""145555ect""!= "145555ect" (see the "")
  //so we need to use JSON.parse to make it a useable string

  // console.log(data);
  // setUserId(data)
  // getUser()

  // }, [])

  // get request to api/user/???

  // const getUser = async()=> {

  //   let response=await fetch(`/api/user/${userId}`);

  //   let data = await response.json()

  //   setUserInfo(data)
  //   return res.status(422).send("somethings wrong")

  // }

  return (
    <div className="bg-violet-900 h-fit">
      <Layout
        profileImage={profileImage}
        userName={userName}
      />
      {/* <p> {currentProfilePicture}</p> */}

      <section>
        {/* <p> {(valuetest)}</p> */}

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

              {/* <div className="float-right mb-4">
                        <GeneralButton text="Sort Names by Categories"></GeneralButton>
                  </div> */}
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
                      // tagList={tagList}
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
                return (
                  <SingleComment
                    rootComment={comment}
                    sessionFromServer={sessionFromServer}
                  />
                );
              })}
          </section>
          {/* {console.log(likedComments)} */}
          {/* {console.log(postsLiked)} */}
          {/* ############# POSTS COMMENTS LIST ############ */}
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

      <section>
        <p> extra </p>
      </section>
    </div>
  );
}
