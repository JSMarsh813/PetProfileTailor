"use client";

import { useState, useRef, useEffect } from "react";

import NameListingAsSections from "@components/ShowingListOfContent/NameListingAsSections";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import PointSystemList from "@components/Ranking/PointSystemList";
import DashboardChartForFavDescriptions from "@components/ShowingListOfContent/DashboardChartForFavDescriptions";
import FollowButton from "@components/ReusableSmallComponents/buttons/FollowButton";
import EditBioAndProfile from "@components/EditingData/EditBioAndProfile";
import EditBioProfileButton from "@components/ReusableSmallComponents/buttons/EditBioProfileButton";
import UsersFollowersList from "@components/ShowingListOfContent/UsersFollowersList";
import UsersFollowingList from "@components/ShowingListOfContent/UsersFollowingList";

import { useSession } from "next-auth/react";

export default function profile({
  userData,
  nameList,
  likedNames,
  usersLikedContent,
  createdDescriptions,
  likedDescriptions,
  usersFollowing,
}) {
  console.log("userData in profile", userData);
  const { data: session } = useSession();

  // store liked IDs in a ref so updates don't trigger full re-render
  const likedSetRef = useRef(new Set(usersLikedContent));
  const recentLikesRef = useRef({}); // { [nameId]: 1 | 0 | -1 }
  // tracks if the likes count has to be updated, important for if the user navigates backwards

  let userName = "";
  let profileImage = "";
  let signedInUsersId = "";
  if (session?.user) {
    userName = session.user.name;
    profileImage = session.user.profileimage;
    signedInUsersId = session.user.id;
  }

  let userIsTheCreator = userData._id === signedInUsersId;

  const [showProfileEditPage, setShowProfileEditPage] = useState(false);
  const [profileChanged, setProfileChange] = useState(false);

  const [showFollowersList, setShowFollowersListPage] = useState(false);

  const [showFollowingList, setShowFollowingList] = useState(false);

  const [nameEdited, setNameEdited] = useState(false);

  // for names
  const [deleteThisContentId, setDeleteThisContentId] = useState(null);

  function updateSetShowProfileEditPage() {
    setShowProfileEditPage(!showProfileEditPage);
  }

  function updateSetProfileChange() {
    setProfileChange(!profileChanged);
  }

  function showListOfFollowers() {
    setShowFollowersListPage(!showFollowersList);
  }

  function showfollowingListFunction() {
    setShowFollowingList(!showFollowingList);
  }

  function setNameEditedFunction() {
    setNameEdited(!nameEdited);
  }

  // for names
  //########### Section that allows the deleted content to be removed without having to refresh the page, react notices that a key has been removed from the content list and unmounts that content ###########

  useEffect(() => {
    if (deleteThisContentId !== null) {
      removeDeletedContent(
        // setFilteredNames,
        // filteredNames,
        deleteThisContentId,
        setDeleteThisContentId,
      );
    }
  }, [deleteThisContentId]);
  return (
    <div>
      <p className="text-subtleWhite bg-red-700 text-center my-2">
        Profile pages do not currently have SWR, so you will need to refresh to
        see the changes you make
      </p>
      <div className="flex flex-col md:flex-row">
        {/* ############## BIO ############## */}
        <section className=" sm:w-96 text-secondary ">
          <div className="px-2 ">
            <div
              className="relative flex flex-col min-w-0 break-words bg-purple-50 mb-6 shadow-xl rounded-lg mt-16
    shadow-slate-900/70"
            >
              <div className="px-0">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-4 flex justify-center">
                    <div className="relative">
                      <img
                        src={userData.profileimage}
                        alt=""
                        className="rounded-2xl align-middle -mt-16 h-36"
                      />
                    </div>
                  </div>
                  <div className="w-full text-center mt-2">
                    <span className="text-xl font-bold leading-normal ">
                      {userData.name}
                    </span>
                    <span> @{userData.profilename} </span>

                    <div className="flex justify-center py-4">
                      <div className="mr-4 text-center">
                        <span className="text-xl font-bold block tracking-wide">
                          {usersFollowing.length}
                        </span>
                        <button
                          className="text-sm"
                          onClick={() => showfollowingListFunction()}
                        >
                          Following
                        </button>
                      </div>

                      <div className="text-center">
                        <span className="text-xl font-bold block tracking-wide">
                          {userData.followers.length}
                        </span>
                        <button
                          className="text-sm"
                          onClick={() => showListOfFollowers()}
                        >
                          Followers
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  {userName != "" && session.user.id == userData._id ? (
                    <EditBioProfileButton
                      setShowProfileEditPage={updateSetShowProfileEditPage}
                    />
                  ) : (
                    <div className=" w-full pb-4">
                      <FollowButton
                        data={userData}
                        session={session}
                      />
                    </div>
                  )}

                  <div className="text-sm leading-normal mt-4 mb-2 font-bold ">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="mr-2 text-lg "
                    />

                    <span className="mr-2 text-lg">{userData.location}</span>
                  </div>
                </div>

                <div className="py-2 border-t border-secondary text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full px-4">
                      <span className="text-lg font-bold">About:</span>

                      <p className="leading-relaxed">
                        {userData.bioblurb || "No bio written yet"}
                      </p>
                    </div>
                  </div>
                </div>

                <section className="relative pb-6 bg-secondary mb-4">
                  <div className="container mx-auto px-2">
                    <PointSystemList
                      namesLikes={likedNames.length}
                      namesAdds={nameList.length}
                      descriptionsLikes={likedDescriptions.length}
                      descriptionsAdds={createdDescriptions.length}
                    />

                    {/* <PointSystemList
                      favNames={likedNames}
                      namesCreated={nameList}
                      createdDescriptions={createdDescriptions}
                      likedDescriptions={likedDescriptions}
                    /> */}
                  </div>
                </section>
              </div>
            </div>
          </div>
          {/* ###########  FOOTER  ########### */}
        </section>

        {/* ######## USERS CONTRIBUTIONS SECTION ##########*/}

        <div className=" flex-1 grid grid-cols-1 gap-4 mr-2 h-fit text-white bg-secondary">
          {/* ########## NAMES ADDED  ################*/}
          <section className="my-4">
            <h2
              className="w-full text-center font-semibold text-amber-300
                            text-xl
                             p-2 
                            "
            >
              Names Added
            </h2>
            <div
              className=" flex-1 grid grid-cols-1 gap-4 mr-2  
 w-full
 border-2 border-amber-300"
            >
              {!nameList.length ? (
                <section className="border-2 border-amber-300">
                  <span> no names added yet! </span>
                </section>
              ) : (
                <section className="border-2 border-amber-300 w-full">
                  <section className="">
                    {/* {nameList.map((name) => {
                      return (
                        <NameListingAsSections
                          name={name}
                          key={name._id}
                          signedInUsersId={signedInUsersId}
                          dataType="names"
                          setNameEditedFunction={setNameEditedFunction}
                          setDeleteThisContentId={setDeleteThisContentId}
                          likedSetRef={likedSetRef}
                          recentLikesRef={recentLikesRef}
                        />
                      );
                    })} */}
                  </section>
                </section>
              )}
            </div>
          </section>

          {/* ############## DESCRIPTIONS ADDED ##############*/}
          <section className="my-2">
            <h2
              className="w-full text-center font-semibold text-amber-300 
            text-xl
            bg-secondary p-2 
            "
            >
              Descriptions Added
            </h2>

            {/* <div
              className=" flex-1 grid grid-cols-1 gap-4 mr-2  
 w-full
 border-2 border-amber-300"
            >
              {!createdDescriptions.length ? (
                <section className="border-2 border-amber-300">
                  <span> No descriptions added yet! </span>
                </section>
              ) : (
                <section className="border-2 border-amber-300">
                  <DashboardChartForFavDescriptions
                    likedDescriptions={createdDescriptions}
                    dataType="descriptions"
                    sessionFromServer={session}
                  />
                </section>
              )}
            </div> */}

            {showProfileEditPage && (
              <EditBioAndProfile
                userData={userData}
                sessionFromServer={session}
                setShowProfileEditPage={updateSetShowProfileEditPage}
                setProfileChange={updateSetProfileChange}
              />
            )}

            {showFollowersList && (
              <UsersFollowersList
                userData={userData}
                sessionFromServer={session}
                setShowUsersListPage={showListOfFollowers}
              />
            )}

            {showFollowingList && (
              <UsersFollowingList
                userData={usersFollowing}
                sessionFromServer={session}
                setShowUsersListPage={showfollowingListFunction}
              />
            )}
          </section>
        </div>
      </div>

      <section></section>
    </div>
  );
}
