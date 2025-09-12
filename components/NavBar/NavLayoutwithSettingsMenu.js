import { signOut } from "next-auth/react";
import Link from "next/link";
// //Special jsx code that allows us to build links. Allows us to keep everything on a single page (makes it a SPA), rather than using a href="page link", which would make us lose any state and require that we get a new file sent from the server

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import MobileNavBar from "./NavBarPieces/MobileNavBar/MobileNavBar";
import NavBarNames from "./NavBarPieces/DesktopNavBar/NavBarNames";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { forwardRef } from "react";
import ProfileImage from "@components/ReusableSmallComponents/ProfileImage";
import LinkButton from "@components/ReusableSmallComponents/buttons/LinkButton";
import LinkMenu from "./LinkMenu";

export default function NavLayoutwithSettingsMenu({
  children,
  userName,
  profileImage,
  sessionFromServer,
}) {
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
        hover:bg-subtleWhite
        hover:text-secondary
        text-center                   
 
`}
        {...rest}
      >
        {children}
      </Link>
    );
  });
  MyLink.displayName = "MyLink";

  const MenuItemsStyling =
    "absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none";

  const menuItemStyling = function (focus) {
    return `block px-4 py-2 text-sm text-gray-300 ${
      focus ? "bg-white/10 text-white" : ""
    }`;
  };

  return (
    <>
      <div className="flex flex-col justify-between bg-primary">
        <header className="my-1">
          <nav className="flex h-12 items-center pl-2 justify-between  bg-primary">
            {/* HAMBURGER MENU BUTTON */}

            <MobileNavBar />

            <LinkButton
              className="text-lg font-extrabold text-yellow-300 
              hidden lg:block
              mx-auto ml-2 hover:text-subtleWhite"
              href="/"
              text=" TailoredPetNames"
            />

            <NavBarNames />

            <div className="mr-2">
              {userName != "" ? (
                <Menu
                  as="div"
                  className="relative inline-block text-left z-30"
                >
                  <MenuButton
                    className="inline-flex items-center justify-center 
            text-subtleWhite
             hover:border-b-4 hover:border-blue-100
             focus:outline-none focus-visible:ring-2 
             focus-visible:ring-white focus-visible:ring-opacity-75
             hover:text-subtleWhite"
                  >
                    <span className="text-base font-bold sm:ml-2">
                      {userName}
                    </span>

                    <ProfileImage
                      divStyling={"ml-3 h-8 w-8 relative"}
                      profileImage={profileImage}
                      className="rounded-full inline relative"
                    />

                    <ChevronDownIcon
                      className="ml-1 h-5 w-5 text-violet-200 hover:text-amber-300"
                      aria-hidden="true"
                    />
                  </MenuButton>

                  <MenuItems className={MenuItemsStyling}>
                    <MenuItem>
                      {({ focus }) => (
                        <LinkMenu
                          href="/dashboard"
                          focus={focus}
                          className={menuItemStyling(focus)}
                        >
                          Dashboard
                        </LinkMenu>
                      )}
                    </MenuItem>

                    {sessionFromServer.user.profilename && (
                      <MenuItem>
                        {({ focus }) => (
                          <LinkMenu
                            href={`${
                              process.env.NEXT_PUBLIC_BASE_FETCH_URL
                            }profile/${sessionFromServer.user.profilename.toLowerCase()}`}
                            focus={focus}
                            className={menuItemStyling(focus)}
                          >
                            Profle
                          </LinkMenu>
                        )}
                      </MenuItem>
                    )}

                    <MenuItem>
                      {({ focus }) => (
                        <LinkMenu
                          href={`/editsettings`}
                          focus={focus}
                          className={menuItemStyling(focus)}
                        >
                          Settings
                        </LinkMenu>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={logoutClickHandler}
                          className={`${menuItemStyling(
                            focus,
                          )} w-full text-left`}
                        >
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              ) : (
                <Menu
                  as="div"
                  className="relative inline-block text-left z-30"
                >
                  <LinkButton
                    basic
                    href="/login"
                    text="login"
                    className="text-sm"
                  />
                  <LinkButton
                    defaultStyle
                    href="/register"
                    text="register"
                    className="text-sm"
                  />
                  {/* <MenuButton
                    className="inline-flex justify-center rounded-2xl  py-2 px-4 text-sm font-semibold  text-subtleWhite bg-primary 
                
                
                
                hover:bg-opacity-30 hover:border-b-yellow-400

                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <Link href="/login">login</Link>
                  </MenuButton> */}
                </Menu>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto px-4 ">{children}</main>
      </div>
    </>
  );
}
