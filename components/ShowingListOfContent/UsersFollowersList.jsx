import React from "react";
import XSvgIcon from "../ReusableSmallComponents/iconsOrSvgImages/XSvgIcon";
import FollowButton from "../ReusableSmallComponents/buttons/FollowButton";
import Image from "next/image";
import ProfileImage from "../ReusableSmallComponents/ProfileImage";
import GifHover from "../ReusableSmallComponents/GifHover";

export default function UsersFollowersList({
  setShowUsersListPage,
  userData,
  sessionFromServer,
}) {
  return (
    <>
      <div>
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            {/* centers content */}
            <div
              className="            
            p-4 text-center sm:items-center sm:p-0 
            max-w-3xl
            mx-auto my-2"
            >
              <div>
                <div className="relative">
                  {/* X Button and SVG Icon */}

                  <XSvgIcon
                    screenReaderText="Close Edit Screen"
                    onClickAction={() => setShowUsersListPage(false)}
                  />

                  <div
                    className="mx-auto flex flex-col font-semibold text-secondary bg-violet-900
                 border-2 border-violet-400 border-dotted 
                 p-4 shadow-lg max-w-3xl"
                  >
                    <h1 className="text-white text-xl">Followers </h1>
                  </div>

                  {userData.followers[0] ? (
                    userData.followers.map((follower) => (
                      <a
                        key={follower._id}
                        href={`${
                          process.env.NEXT_PUBLIC_BASE_FETCH_URL
                        }profile/${follower.profilename.toLowerCase()}`}
                      >
                        <section
                          className="grid 
    grid-cols-4 gap-4 
    border-b-2 border-amber-300
    bg-secondary
            text-purple-200 p-2  
            
            
            items-center justify-items-center"
                        >
                          {/* ###### PROFILE IMAGE #### */}

                          <ProfileImage
                            divStyling="w-16"
                            profileImage={follower.profileimage}
                            layout="responsive"
                            className="rounded-2xl h-16"
                            width={100}
                            height={100}
                          />

                          {/* ###### PROFILE name, profile and bioblurb #### */}
                          <section>
                            <span className="block"> {follower.name}</span>

                            <span className="block">
                              {" "}
                              @{follower.profilename}
                            </span>
                          </section>

                          <p>{follower.bioblurb}</p>

                          <section>
                            {!(follower._id == sessionFromServer.user._id) && (
                              <FollowButton
                                data={follower}
                                session={sessionFromServer}
                              />
                            )}
                          </section>
                        </section>
                      </a>
                    ))
                  ) : (
                    <div className="bg-secondary items-center">
                      <p className="py-4">No followers currently 😿</p>

                      <p> Lets find some friends! </p>

                      <GifHover
                        divStyling="w-60 mx-auto py-6"
                        className="rounded-full"
                        layout="responsive"
                        gifSrc="/kittentopuppy.webp"
                        stillImageSrc="/kittentopuppy.png"
                        alt="gif of a kitten climbing out of its cage into the excited puppies cage next to it"
                        width={300}
                        height={300}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
