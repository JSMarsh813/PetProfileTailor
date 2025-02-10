import { signOut } from "next-auth/react";
import Link from "next/link";
// //Special jsx code that allows us to build links. Allows us to keep everything on a single page (makes it a SPA), rather than using a href="page link", which would make us lose any state and require that we get a new file sent from the server
import Image from "next/image";
import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import MobileNavBar from "./NavBarPieces/MobileNavBar/MobileNavBar";
import NavBarNames from "./NavBarPieces/DesktopNavBar/NavBarNames";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { forwardRef } from "react";
import ProfileImage from "../ReusableSmallComponents/ProfileImage";

export default function NavLayoutwithSettingsMenu({
  children,
  userName,
  profileImage,
  sessionFromServer,
}) {
  const [isHamBurgNavOpen, setisHamBurgNavOpen] = useState(false);

  const logoutClickHandler = () => {
    signOut({ callbackUrl: "/login" });
  };

  const MyLink = forwardRef((props, ref) => {
    let { href, active, children, ...rest } = props;
    return (
      <Link
        href={href}
        ref={ref}
        className={`block rounded-md px-2 py-2 text-md
        hover:bg-yellow-400
        hover:text-violet-900  
        text-center                   
    ${active ? "bg-yellow-400 text-violet-900" : "bg-violet-800"}
`}
        {...rest}
      >
        {children}
      </Link>
    );
  });
  MyLink.displayName = "MyLink";

  return (
    <>
      <div className="flex flex-col justify-between bg-violet-900">
        <header>
          <nav className="flex h-12 items-center pl-2 justify-between shadow-md bg-violet-600">
            {/* HAMBURGER MENU BUTTON */}

            <Menu
              as="div"
              className="relative inline-block text-white  z-30 lg:hidden pt-4 "
            >
              {/* md:hidden makes it so the dropdown will be hidden if the screen is enlarged from a small screen. Important because the hamburger button disappears on medium screens */}

              <Menu.Button
                className="inline-flex justify-center xl:hidden
                focus-visible:ring-white 
                focus-visible:ring-opacity-75"
              >
                <FontAwesomeIcon
                  icon={faBars}
                  className="text-xl text-violet-100 hover:text-yellow-300"
                  aria-hidden="true"
                />
              </Menu.Button>

              <MobileNavBar />
            </Menu>

            <MyLink
              className="text-lg font-extrabold text-yellow-300 
              block 
              mx-auto ml-2 hover:text-violet-100"
              href={`/`}
            >
              TailoredPetNames
            </MyLink>

            <NavBarNames />

            <div className="mr-2">
              {userName != "" ? (
                <Menu
                  as="div"
                  className="relative inline-block text-left z-30"
                >
                  <Menu.Button
                    className="inline-flex justify-center 
                  text-yellow-400 
                  
                  border-4 border-transparent 
                  
               
                  hover:border-b-6
                  hover:border-b-yellow-400 
        
                  focus:outline-none 
                  focus-visible:ring-2 
                  focus-visible:ring-white 
                  focus-visible:ring-opacity-75
                  
                  hover:text-violet-100"
                  >
                    <span className="text-base font-bold sm:ml-2">
                      {userName}
                    </span>

                    <ProfileImage
                      divStyling={"ml-3 h-8 w-8 relative"}
                      profileImage={profileImage}
                      className="ml-3 rounded-full inline relative"
                    />

                    <ChevronDownIcon
                      className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-amber-300"
                      aria-hidden="true"
                    />
                  </Menu.Button>

                  <Menu.Items className="absolute font-bold right-0 w-56 z-30 origin-top-right bg-violet-800 text-white shadow-lg ">
                    <Menu.Item>
                      {({ active }) => (
                        <MyLink
                          href={`/dashboard`}
                          active={active}
                        >
                          dashboard
                        </MyLink>
                      )}
                    </Menu.Item>

                    {sessionFromServer.user.profilename && (
                      <Menu.Item>
                        {({ active }) => (
                          <MyLink
                            href={`${
                              process.env.NEXT_PUBLIC_BASE_FETCH_URL
                            }profile/${sessionFromServer.user.profilename.toLowerCase()}`}
                            active={active}
                          >
                            Profile
                          </MyLink>
                        )}
                      </Menu.Item>
                    )}

                    <Menu.Item>
                      {({ active }) => (
                        <MyLink
                          href={`/editsettings`}
                          active={active}
                        >
                          Settings
                        </MyLink>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <MyLink
                          href={`/`}
                          active={active}
                          onClick={logoutClickHandler}
                        >
                          Logout
                        </MyLink>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Menu
                  as="div"
                  className="relative inline-block text-left z-30"
                >
                  <Menu.Button
                    className="inline-flex justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium         text-yellow-400
                
                border-4 border-transparent 
                
                hover:bg-opacity-30 hover:border-b-yellow-400

                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <Link href="/login">login</Link>
                  </Menu.Button>
                </Menu>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4 ">{children}</main>
      </div>
    </>
  );
}
