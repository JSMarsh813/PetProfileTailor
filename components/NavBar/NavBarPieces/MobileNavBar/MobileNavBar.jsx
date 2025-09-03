import React from "react";
import { Menu, MenuItem, MenuItems, MenuButton } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faIgloo, faIdCard } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function MobileNavBar() {
  return (
    <Menu
      as="div"
      className="inline-block w-full lg:hidden z-50 "
    >
      {/* Hamburger Button */}
      <MenuButton className="inline-flex justify-center p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-subtleWhite">
        <FontAwesomeIcon
          icon={faBars}
          className="text-xl text-violet-100 hover:text-yellow-300"
        />
      </MenuButton>

      {/* Menu Items */}
      <MenuItems className="absolute  mt-2 w-full  rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y -ml-2  divide-gray-100">
        {/* -ml-2 has it go flush to the left, w-[calc(100vw-17px)] leaves room for the scrollbar on the right */}
        <div className="flex flex-col py-1">
          <MenuItem>
            {({ active }) => (
              <a
                href="/"
                className={`flex items-center px-4 py-2 text-sm text-gray-300 ${
                  active ? "bg-white/10 text-white" : ""
                }`}
              >
                <Link
                  href="/"
                  legacyBehavior
                  passHref
                >
                  <span className="flex items-center">
                    <FontAwesomeIcon
                      icon={faIgloo}
                      className={`text-xl mr-1 ${
                        active ? "text-violet-800" : "text-violet-100"
                      }`}
                    />
                    Home
                  </span>
                </Link>
              </a>
            )}
          </MenuItem>

          <MenuItem disabled>
            <button
              className="text-subtleWhite w-full text-left rounded-md px-2 py-2 text-sm font-bold bg-darkPurple cursor-not-allowed"
              disabled
            >
              Fetch/Find
            </button>
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              <a
                href="/fetchnames"
                className={`flex items-center px-4 py-2 text-sm text-gray-300 ${
                  active ? "bg-white/10 text-white" : ""
                }`}
              >
                <Link
                  href="/fetchnames"
                  legacyBehavior
                  passHref
                >
                  <span className="flex items-center">
                    <FontAwesomeIcon
                      icon={faTags}
                      className={`text-xl mr-1 ${
                        active ? "text-violet-800" : "text-violet-100"
                      }`}
                    />
                    Names
                  </span>
                </Link>
              </a>
            )}
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              <a
                href="/fetchdescriptions"
                className={`flex items-center px-4 py-2 text-sm text-gray-300 ${
                  active ? "bg-white/10 text-white" : ""
                }`}
              >
                <Link
                  href="/fetchdescriptions"
                  legacyBehavior
                  passHref
                >
                  <span className="flex items-center">
                    <FontAwesomeIcon
                      icon={faIdCard}
                      className={`text-xl mr-1 ${
                        active ? "text-violet-800" : "text-violet-100"
                      }`}
                    />
                    Descriptions
                  </span>
                </Link>
              </a>
            )}
          </MenuItem>

          <MenuItem disabled>
            <button
              className="text-subtleWhite w-full text-left rounded-md px-2 py-2 text-sm font-bold bg-darkPurple cursor-not-allowed"
              disabled
            >
              Add
            </button>
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              <a
                href="/addnames"
                className={`flex items-center px-4 py-2 text-sm text-gray-300 ${
                  active ? "bg-white/10 text-white" : ""
                }`}
              >
                <Link
                  href="/addnames"
                  legacyBehavior
                  passHref
                >
                  <span className="flex items-center">
                    <FontAwesomeIcon
                      icon={faTags}
                      className={`text-xl mr-1 ${
                        active ? "text-violet-800" : "text-violet-100"
                      }`}
                    />
                    Names
                  </span>
                </Link>
              </a>
            )}
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              <a
                href="/adddescriptions"
                className={`flex items-center px-4 py-2 text-sm text-gray-300 ${
                  active ? "bg-white/10 text-white" : ""
                }`}
              >
                <Link
                  href="/adddescriptions"
                  legacyBehavior
                  passHref
                >
                  <span className="flex items-center">
                    <FontAwesomeIcon
                      icon={faIdCard}
                      className={`text-xl mr-1 ${
                        active ? "text-violet-800" : "text-violet-100"
                      }`}
                    />
                    Descriptions
                  </span>
                </Link>
              </a>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
