import React, { useEffect, useState } from "react";
import XSvgIcon from "../ReusableSmallComponents/iconsOrSvgImages/XSvgIcon";
import FollowButton from "../ReusableSmallComponents/buttons/FollowButton";
import Image from "next/image";

export default function UsersFollowingList({
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
                    className="mx-auto flex flex-col font-semibold text-darkPurple bg-violet-900
                 border-2 border-violet-400 border-dotted 
                 p-4 shadow-lg max-w-3xl"
                  >
                    <h1 className="text-white text-xl">Following </h1>
                  </div>

                  {userData[0] ? (
                    userData.map((person) => (
                      <a
                        key={person._id}
                        href={`http://localhost:3000/profile/${person.name.toLowerCase()}`}
                      >
                        <section
                          className="grid 
    grid-cols-4 gap-4 
    border-b-2 border-amber-300
    bg-darkPurple
            text-purple-200 p-2  
            
            
            items-center justify-items-center"
                        >
                          {/* ###### PROFILE IMAGE #### */}
                          <Image
                            src={person.profileimage}
                            className="rounded-2xl h-16"
                            alt="users profile image"
                            width={100}
                            height={100}
                            layout="responsive"
                          />
                          {/* ###### PROFILE name, profile and bioblurb #### */}
                          <section>
                            <span className="block"> {person.name}</span>

                            <span className="block">@{person.profilename}</span>
                          </section>

                          <p>{person.bioblurb}</p>

                          <section>
                            <FollowButton
                              data={person}
                              session={sessionFromServer}
                            />
                          </section>
                        </section>
                      </a>
                    ))
                  ) : (
                    <div className="bg-darkPurple items-center">
                      <p className="py-4">Currently not following anyone 😿</p>

                      <p> Lets find some friends! </p>
                      <Image
                        className="mx-auto pt-2 pb-6 rounded-full"
                        src="/kittentopuppy.webp"
                        alt="gif of a kitten climbing out of its cage into the excited puppies cage next to it"
                        layout="responsive"
                        width={100}
                        height={100}
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
